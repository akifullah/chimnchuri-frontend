
"use client";

import { createContext, useContext } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({
    settings,
    children,
}) {
    return (
        <SettingsContext.Provider value={{ settings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error("useSettings must be used inside SettingsProvider");
    }
    return context.settings;
}

export const useCurrency = () => {
    const settings = useSettings();
    return {
        code: settings?.currency_code,
        symbol: settings?.currency_symbol ?? "Rs.",
        format: (amount) => `${settings?.currency_symbol ?? "Rs."} ${amount}`,
    };
}
