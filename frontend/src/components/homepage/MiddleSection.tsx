import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./MiddleSection.css";

interface MiddleSectionItem {
  text: string;
}

export function MiddleSection(): React.JSX.Element {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        // toggle on enter/exit so animation can replay
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const items = t("middleSection.items", {
    returnObjects: true,
  }) as MiddleSectionItem[];

  return (
    <section
      ref={ref}
      className={`middle-section ${visible ? "visible" : ""}`}
      id="gallery"
    >
      <div className="container">
        {items.map((it: { text: string }, idx: number) => (
          <div className="item" key={idx}>
            <img
              src="/images/placeholder-image.jpg"
              alt={t("middleSection.items." + idx + ".text")}
            />
            <p>{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
