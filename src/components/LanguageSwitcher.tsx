import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("i18nextLng", lng);
    } catch {}
  };

  return (
    <div className="inline-flex items-center">
      <label htmlFor="language-select" className="sr-only">Langue</label>
      <select
        aria-label="Choisir la langue"
        id="language-select"
        value={i18n.language || "fr"}
        onChange={change}
        className="border rounded px-2 py-1 text-sm bg-white">
        <option value="fr">FR</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
