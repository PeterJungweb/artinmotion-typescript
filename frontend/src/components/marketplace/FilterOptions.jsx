import React from "react";
import { useTranslation } from "react-i18next";
import "./FilterOptions.css";

export default function FilterOptions({ activeFilter, onFilterChange }) {
  const { t } = useTranslation();

  return (
    <div className="marketplace-filters">
      <h3>{t("marketplace.filters.title")}</h3>
      <div className="filter-options">
        <button
          className={activeFilter === "all" ? "active" : ""}
          onClick={() => onFilterChange("all")}
        >
          {t("marketplace.filters.all")}
        </button>
        <button
          className={activeFilter === "available" ? "active" : ""}
          onClick={() => onFilterChange("available")}
        >
          {t("marketplace.filters.available")}
        </button>
        <button
          className={activeFilter === "sold" ? "active" : ""}
          onClick={() => onFilterChange("sold")}
        >
          {t("marketplace.filters.sold")}
        </button>
      </div>
    </div>
  );
}
