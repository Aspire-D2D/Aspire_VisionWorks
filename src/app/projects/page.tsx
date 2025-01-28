
"use client";
import Head from 'next/head';
import { useRouter } from 'next/navigation'; 
import styles from './projects.module.css';

const Projects = () => {
    const router = useRouter();

    const handleStartProject = () => {
      router.push('/contact');
    };

  return (
    <>
      <Head>
        <title>Our Projects</title>
      </Head>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Our Projects</h1>
          <p>Innovative solutions, always forward thinking.</p>
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.textBlock}>
          <h2 className={styles.heading}>
            Let’s Create Something Amazing Together
          </h2>
          <p className={styles.paragraph}>
            At the moment, we do not have any active projects underway. However, we are continuously working on new and exciting opportunities, and we’d love to collaborate with you soon. Whether you’re looking to start a fresh project or seeking innovative solutions, we are ready and eager to bring your ideas to life.
          </p>
          <button className={styles.ctaButton} onClick={handleStartProject}>Start Your Journey</button>
        </div>
      </section>
    </>
  );
};

export default Projects;
