import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./AboutSection.css";

export function AboutSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) =>
        setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="about"
      className={`about-section ${visible ? "visible" : ""}`}
    >
      <div className="container">
        <div className="image-container">
          <img
            src="/images/placeholder-image.jpg"
            alt={t("aboutSection.imageAlt")}
          />
        </div>
        <div className="text-container">
          <h2>{t("aboutSection.title")}</h2>
          {(
            t("aboutSection.paragraphs", { returnObjects: true }) as string[]
          ).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
