"use client";
import { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

export default function HeroSection() {
  const [isConcept, setIsConcept] = useState(true);
  const [isCreation, setIsCreation] = useState(true);
  const [animationClass, setAnimationClass] = useState(styles.slideUp);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationClass(styles.slideDown);
      setTimeout(() => {
        setIsConcept((prev) => !prev);
        setIsCreation((prev) => !prev);
        setAnimationClass(styles.slideUp);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.headline}>
          <h1 className={styles.headline}>From</h1>
          <h1 className={`${styles.headline} ${animationClass}`}>{isConcept ? "Concept" : "Creation"}</h1>
          <h1 className={styles.headline}> to </h1>
          <h1 className={`${styles.headline} ${animationClass}`}>{isCreation ? "Creation" : "Development"} :</h1>
          <h1 className={styles.headline}>Your Digital Partner</h1>
        </div>
        <p className={styles.subheading}>
          Transform your ideas into impactful <strong>Digital Experiences</strong> with Aspire D2D. We specialize in <strong>Tailored Design</strong> and development solutions that drive results.
        </p>
        <button className={styles.ctaButton}>
          <FontAwesomeIcon icon={faRocket} className={styles.icon} />
          Set Your Ideas in Motion
        </button>
      </div>
    </div>
  );
}