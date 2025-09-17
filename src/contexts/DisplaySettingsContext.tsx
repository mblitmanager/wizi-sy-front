import React, { createContext, useContext, useEffect, useState } from "react";

type InterfaceChoice = "classic" | "modern" | "compact";

export type DisplaySettings = {
  interfaceChoice: InterfaceChoice;
  showTutorials: boolean;
};

type DisplaySettingsContextType = {
  settings: DisplaySettings;
  setInterfaceChoice: (c: InterfaceChoice) => void;
  setShowTutorials: (v: boolean) => void;
  reset: () => void;
};

const DEFAULT: DisplaySettings = {
  interfaceChoice: "classic",
  showTutorials: true,
};

const Context = createContext<DisplaySettingsContextType | undefined>(
  undefined
);

const STORAGE_KEY = "wizi_display_settings_v1";

export const DisplaySettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [settings, setSettings] = useState<DisplaySettings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT, ...(JSON.parse(raw) as Partial<DisplaySettings>) };
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
  }, [settings]);

  const setInterfaceChoice = (interfaceChoice: InterfaceChoice) =>
    setSettings((s) => ({ ...s, interfaceChoice }));

  const setShowTutorials = (showTutorials: boolean) =>
    setSettings((s) => ({ ...s, showTutorials }));

  const reset = () => setSettings(DEFAULT);

  return (
    <Context.Provider
      value={{ settings, setInterfaceChoice, setShowTutorials, reset }}>
      {children}
    </Context.Provider>
  );
};

// Export context object separately; hook is provided in a separate file to
// avoid Fast Refresh issues when exporting non-component functions from the
// same module as components.
export const DisplaySettingsContext = Context;

export default DisplaySettingsProvider;
