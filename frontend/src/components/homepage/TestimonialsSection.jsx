import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./TestimonialsSection.css";

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const testimonials = t("testimonialsSection.testimonials", {
    returnObjects: true,
  });

  return (
    <section
      ref={ref}
      id="testimonials"
      className={`testimonials-section ${visible ? "visible" : ""}`}
    >
      <div className="container">
        {testimonials.map((item, idx) => (
          <div className="testimonial" key={idx}>
            <img src="/images/placeholder-image.jpg" alt={item.text} />
            <p>{item.text}</p>
            <div className="stars">{item.stars}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
