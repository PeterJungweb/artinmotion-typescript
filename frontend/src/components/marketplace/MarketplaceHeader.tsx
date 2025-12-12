import React from "react";
import { useTranslation } from "react-i18next";
import "./MarketplaceHeader.css";

export function MarketplaceHeader(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="marketplace-header">
      <h1>{t("marketplace.header.title")}</h1>
      <p>{t("marketplace.header.subtitle")}</p>
    </div>
  );
}
