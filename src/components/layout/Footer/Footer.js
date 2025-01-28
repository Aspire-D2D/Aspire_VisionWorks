import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <h3>Aspire D2D</h3>
          <p>Where innovation meets digital transformation. Let's build the future together!</p>
        </div>
        <div className={styles.footerRight}>
          <p>Have a question or idea? Get in touch with us: <a href="mailto:info@aspired2d.com">info@aspired2d.com</a></p>
        </div>
      </div>
      <div className={styles.footerSocialMedia}>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebook} className={styles.icon} />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} className={styles.icon} />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} className={styles.icon} />
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} className={styles.icon} />
        </a>
      </div>
      <div className={styles.footerCopyright}>
        <p>&copy; 2023 Aspire D2D. All rights reserved.</p>
      </div>
    </footer>
  );
}