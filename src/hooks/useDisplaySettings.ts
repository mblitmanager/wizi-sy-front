import { useContext } from "react";
import {
  DisplaySettingsContext,
  DisplaySettings,
} from "@/contexts/DisplaySettingsContext";

export type UseDisplaySettingsReturn = {
  settings: DisplaySettings;
  setInterfaceChoice: (c: DisplaySettings["interfaceChoice"]) => void;
  setShowTutorials: (v: boolean) => void;
  reset: () => void;
};

export const useDisplaySettings = (): UseDisplaySettingsReturn => {
  const ctx = useContext(DisplaySettingsContext as unknown as React.Context<UseDisplaySettingsReturn | undefined>);
  if (!ctx) throw new Error("useDisplaySettings must be used inside provider");
  return ctx as UseDisplaySettingsReturn;
};

export default useDisplaySettings;
