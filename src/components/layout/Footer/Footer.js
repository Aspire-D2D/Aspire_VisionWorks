import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerHeading}>
          <h3>VisionWorks</h3>
          <p>Innovation of: Aspire Design and Development</p>
        </div>

        <div className={styles.footerLinks}>
          <Link href="https://www.facebook.com" target="_blank">
            Facebook
          </Link>
          <Link href="https://www.twitter.com" target="_blank">
            Twitter
          </Link>
          <Link href="https://www.linkedin.com" target="_blank">
            LinkedIn
          </Link>
          <Link href="https://www.instagram.com" target="_blank">
            Instagram
          </Link>
        </div>
      </div>

      <div className={styles.footerCopyright}>
        <p>&copy; {new Date().getFullYear()} Aspire D2D. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
