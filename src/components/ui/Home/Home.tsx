import Head from 'next/head';
import HeroSection from '../HeroSection/HeroSection';
import styles from '../Home/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Aspire D2D</title>
        <meta name="description" content="Your digital partner for impactful experiences." />
      </Head>
      <HeroSection />
    </div>
  );
}
