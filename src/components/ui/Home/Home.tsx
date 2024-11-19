"use client";
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from '../../../styles/Home/Home.module.css';

interface ImageData {
  image_url?: string;
  image?: string;
  image_alt_text?: string;
  testimonial_text?: string;
}

export default function Home() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch('/api/home');
        if (!response.ok) {
          setErrorMessage('Error fetching image data');
          return;
        }
        const data: ImageData = await response.json();
        setImageData(data);
      } catch (error) {
        setErrorMessage('Failed to load image');
      }
    };

    fetchImage();
  }, []);

  const fallbackImage = '/home.jpg';

  // Ensure imageUrl is always a string or fallback to a default image
  const imageUrl = imageData?.image_url || imageData?.image || fallbackImage;

  return (
    <div className={styles.container}>
      <Head>
        <title>My Beautiful Homepage</title>
        <meta name="description" content="An attractive homepage with a simple design." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to My Homepage</h1>
        <p className={styles.description}>A clean, attractive design with a single image.</p>

        <div className={styles.imageContainer}>
          {errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            <Image
              src={imageUrl}  // Ensure that imageUrl is never undefined
              alt={imageData?.image_alt_text || 'Homepage Image'}
              width={800}
              height={500}
              className={styles.image}
            />
          )}
        </div>

        {/* Display the testimonial text below the image */}
        {imageData?.testimonial_text && (
          <div className={styles.testimonial}>
            <p>{imageData.testimonial_text}</p>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2024 My Beautiful Website</p>
      </footer>
    </div>
  );
}
