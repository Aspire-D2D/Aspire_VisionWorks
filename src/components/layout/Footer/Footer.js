import Link from 'next/link';

const Footer = () => {
  return (
    <footer style={{ padding: '2rem, 1rem', backgroundColor: '#333', color: 'white', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Aspire D2D</h3>
          <p>Project: VisionWorks</p>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <Link href="https://www.facebook.com" target="_blank" style={{ color: 'white' }}>
            Facebook
          </Link>
          <Link href="https://www.twitter.com" target="_blank" style={{ color: 'white' }}>
            Twitter
          </Link>
          <Link href="https://www.linkedin.com" target="_blank" style={{ color: 'white' }}>
            LinkedIn
          </Link>
          <Link href="https://www.instagram.com" target="_blank" style={{ color: 'white' }}>
            Instagram
          </Link>
        </div>
      </div>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} Aspire D2D. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
