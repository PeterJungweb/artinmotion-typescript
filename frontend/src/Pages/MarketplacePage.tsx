import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MarketplaceHeader } from "../components/marketplace/MarketplaceHeader";
import { FilterOptions } from "../components/marketplace/FilterOptions";
import { PaintingCard } from "../components/marketplace/PaintingCard";
import { paintingsApi } from "../services/api";
import { useRealtimeCartUpdates } from "../hooks/useRealtimeCartUpdates";
import "./MarketplacePage.css";
import { PaintingFromBackend } from "../types/apiTypes";
import { isAxiosError } from "axios";

export default function MarketplacePage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>("all");
  const [paintings, setPaintings] = useState<PaintingFromBackend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Real-time Cart Updates
  const { isConnected, connectionError } = useRealtimeCartUpdates(setPaintings);

  // Fetching the data
  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await paintingsApi.getAll();
        setPaintings(data.paintings || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load paintings");
        }
        if (isAxiosError(err)) {
          console.error("Server Response: ", err.response?.data);
        }
        console.error("❌ Failed to fetch paintings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaintings();
  }, []);

  // Filter paintings based on selected filter
  const filteredPaintings = paintings.filter((painting) => {
    if (filter === "all") return true;
    if (filter === "available") return painting.is_available;
    if (filter === "sold") return !painting.is_available;
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <section className="marketplace-section">
          <MarketplaceHeader />
          <div className="paintings-grid">
            <div className="loading-message">
              <p>{t("marketplace.status.loading")}</p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <section className="marketplace-section">
          <MarketplaceHeader />
          <div className="paintings-grid">
            <div className="error-message">
              <p>{t("marketplace.status.error")}</p>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                {t("marketplace.status.tryAgain")}
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // No paintings found
  if (paintings.length === 0) {
    return (
      <>
        <Header />
        <section className="marketplace-section">
          <MarketplaceHeader />
          <FilterOptions activeFilter={filter} onFilterChange={setFilter} />
          <div className="paintings-grid">
            <div className="no-paintings-message">
              <p>{t("marketplace.status.noResults")}</p>
              <p>{t("marketplace.status.checkBackSoon")}</p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="marketplace-section">
        <MarketplaceHeader />
        <FilterOptions activeFilter={filter} onFilterChange={setFilter} />

        <div className="live-updates-container">
          <div className="live-status">
            <div className="live-status-content">
              {isConnected ? (
                <>
                  <span className="live-dot"></span>
                  <span className="live-text">
                    {t("marketplace.liveUpdates.active")}
                  </span>
                </>
              ) : (
                <>
                  <span className="offline-dot"></span>
                  <span className="live-text">
                    {t("marketplace.liveUpdates.connecting")}
                  </span>
                </>
              )}

              {/* Tooltip Trigger */}
              <div
                className="live-tooltip-trigger"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <span className="tooltip-icon">?</span>

                {/* Tooltip Content */}
                {showTooltip && (
                  <div className="live-tooltip">
                    <div className="tooltip-arrow"></div>
                    <div className="tooltip-content">
                      <h4>{t("marketplace.liveUpdates.tooltip.title")}</h4>
                      <p>{t("marketplace.liveUpdates.tooltip.description")}</p>
                      <ul>
                        <li>{t("marketplace.liveUpdates.tooltip.feature1")}</li>
                        <li>{t("marketplace.liveUpdates.tooltip.feature2")}</li>
                        <li>{t("marketplace.liveUpdates.tooltip.feature3")}</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {connectionError && (
              <div className="connection-error">
                <span className="error-icon">⚠️</span>
                <span>{connectionError}</span>
              </div>
            )}
          </div>
        </div>

        <div className="paintings-grid">
          {filteredPaintings.map((painting) => {
            return <PaintingCard key={painting.id} painting={painting} />;
          })}
        </div>

        {/* Show count */}
        <div className="paintings-count">
          <p>
            {t("marketplace.status.showingCount", {
              filtered: filteredPaintings.length,
              total: paintings.length,
            })}
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
