import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./TopSection.css";

export function TopSection(): React.JSX.Element {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState<boolean>(true);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="top-section" id="home">
      <div className="overlay">
        <div className="text-container">
          <h1>{t("topSection.title")}</h1>
          <p>{t("topSection.secondTitle")}</p>
          <Link
            to="/marketplace"
            className={`cta-button ${!inView ? "fixed" : ""}`}
          >
            {t("topSection.cta")}
          </Link>
        </div>
        <div className="image-container">
          <img src="/images/placeholder-image.jpg" alt="Artwork Preview" />
        </div>
      </div>
    </section>
  );
}
