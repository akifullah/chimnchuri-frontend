"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useSettings } from "@/app/providers/SettingsProvider";
import { fetchDeliveryZones } from "@/lib/api";

/**
 * Haversine formula to calculate the distance (in miles) between two lat/lng points.
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Search postcodes using postcodes.io query API — returns array of matching postcodes
 */
async function searchPostcodes(query) {
    const cleanQuery = query.trim().replace(/\s+/g, " ");
    const res = await fetch(
        `https://api.postcodes.io/postcodes?query=${encodeURIComponent(cleanQuery)}`
    );
    if (!res.ok) {
        throw new Error("Invalid postcode");
    }
    const data = await res.json();
    if (data.status !== 200 || !data.result || data.result.length === 0) {
        throw new Error("Postcode not found");
    }
    return data.result.map((r) => ({
        postcode: r.postcode,
        lat: r.latitude,
        lng: r.longitude,
        ward: r.admin_ward || "",
        district: r.admin_district || "",
    }));
}

/**
 * Geocode a single exact postcode using postcodes.io lookup endpoint
 */
async function lookupPostcode(postcode) {
    const cleanPostcode = postcode.trim().replace(/\s+/g, "");
    const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`
    );
    if (!res.ok) {
        throw new Error("Invalid postcode");
    }
    const data = await res.json();
    if (data.status !== 200 || !data.result) {
        throw new Error("Postcode not found");
    }
    return {
        postcode: data.result.postcode,
        lat: data.result.latitude,
        lng: data.result.longitude,
        ward: data.result.admin_ward || "",
        district: data.result.admin_district || "",
    };
}

/**
 * Custom hook for delivery zone checking (two-step flow)
 *
 * Step 1: searchAddress(query) — searches postcodes.io and returns a dropdown list
 * Step 2: selectAddress(postcodeObj) — user picks a postcode, then zone is calculated
 */
const useDeliveryZone = () => {
    const settings = useSettings();

    const [deliveryZone, setDeliveryZone] = useState(null);
    const [distance, setDistance] = useState(null);
    const [isOutOfRange, setIsOutOfRange] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState(null);
    const [customerAddress, setCustomerAddress] = useState(null);
    const [zones, setZones] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Cache zones to avoid re-fetching
    const zonesCacheRef = useRef(null);
    // Cache store geocode
    const storeGeoRef = useRef(null);

    const getZones = useCallback(async () => {
        if (zonesCacheRef.current) return zonesCacheRef.current;
        const response = await fetchDeliveryZones();
        const zonesData = response.data || response;
        zonesCacheRef.current = zonesData;
        setZones(zonesData);
        return zonesData;
    }, []);

    // Eagerly fetch zones on mount so info cards show immediately
    useEffect(() => {
        getZones().catch(() => { });
    }, [getZones]);

    // Get store geocode (cached)
    const getStoreGeo = useCallback(async () => {
        if (storeGeoRef.current) return storeGeoRef.current;
        const storePostcode = settings?.postcode;
        if (!storePostcode) throw new Error("Store location not configured");
        const geo = await lookupPostcode(storePostcode);
        storeGeoRef.current = geo;
        return geo;
    }, [settings]);

    /**
     * Step 1: Search postcodes — shows dropdown of matching results
     */
    const searchAddress = useCallback(
        async (query) => {
            if (!query || query.trim().length < 2) {
                setError("Please enter at least 2 characters");
                return [];
            }

            setIsSearching(true);
            setError(null);
            setSearchResults([]);
            setShowDropdown(false);
            setDeliveryZone(null);
            setIsOutOfRange(false);
            setDistance(null);
            setCustomerAddress(null);

            try {
                const results = await searchPostcodes(query);
                setSearchResults(results);
                setShowDropdown(true);
                setIsSearching(false);
                return results;
            } catch (err) {
                setError("No postcodes found. Please check and try again.");
                setIsSearching(false);
                setSearchResults([]);
                return [];
            }
        },
        []
    );

    /**
     * Step 2: User selects a postcode from dropdown — calculate zone
     */
    const selectAddress = useCallback(
        async (postcodeObj) => {
            setShowDropdown(false);
            setSearchResults([]);
            setIsChecking(true);
            setError(null);
            setDeliveryZone(null);
            setIsOutOfRange(false);
            setDistance(null);

            try {
                // 1. Fetch delivery zones
                const deliveryZones = await getZones();

                // 2. Get the store geocode
                const storeGeo = await getStoreGeo();

                // 3. Calculate distance using the selected postcode's lat/lng
                const dist = haversineDistance(
                    storeGeo.lat,
                    storeGeo.lng,
                    postcodeObj.lat,
                    postcodeObj.lng
                );

                const roundedDist = Math.round(dist * 10) / 10;
                setDistance(roundedDist);
                setCustomerAddress(postcodeObj);

                // 4. Find matching zone
                const sortedZones = [...deliveryZones].sort(
                    (a, b) => a.max_distance - b.max_distance
                );

                let matchedZone = null;
                for (const zone of sortedZones) {
                    if (roundedDist <= zone.max_distance) {
                        matchedZone = zone;
                        break;
                    }
                }

                if (matchedZone) {
                    setDeliveryZone(matchedZone);
                    setIsOutOfRange(false);
                    setIsChecking(false);
                    return {
                        zone: matchedZone,
                        distance: roundedDist,
                        deliveryFee: matchedZone.delivery_fee,
                        minOrderAmount: matchedZone.minimum_order_amount,
                        customerAddress: postcodeObj,
                    };
                } else {
                    setIsOutOfRange(true);
                    setIsChecking(false);
                    return {
                        zone: null,
                        distance: roundedDist,
                        deliveryFee: 0,
                        minOrderAmount: 0,
                        customerAddress: postcodeObj,
                    };
                }
            } catch (err) {
                setError("Unable to verify delivery address. Please try again.");
                setIsChecking(false);
                return null;
            }
        },
        [getZones, getStoreGeo]
    );

    const reset = useCallback(() => {
        setDeliveryZone(null);
        setDistance(null);
        setIsOutOfRange(false);
        setIsSearching(false);
        setIsChecking(false);
        setError(null);
        setCustomerAddress(null);
        setSearchResults([]);
        setShowDropdown(false);
    }, []);

    return {
        searchAddress,
        selectAddress,
        deliveryZone,
        distance,
        deliveryFee: deliveryZone?.delivery_fee ?? 0,
        minOrderAmount: deliveryZone?.minimum_order_amount ?? 0,
        isOutOfRange,
        isSearching,
        isChecking,
        error,
        customerAddress,
        zones,
        searchResults,
        showDropdown,
        setShowDropdown,
        reset,
    };
};

export default useDeliveryZone;
