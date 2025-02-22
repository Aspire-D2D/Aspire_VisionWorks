"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Loader from '../../loader/loader';
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/checkAdmin");
      const data = await res.json();

      if (data.isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        if (data.message && data.message.includes('Token expired')) {
          router.push('/admin/login');
        }
      }
    };

    fetchData();
  }, [router]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    Cookies.remove('token');
    setTimeout(() => {
      setLoading(false);
      router.push('/admin/login');
    }, 1500);
  };

  // Function to check if the current route matches the link
  const isActive = (path) => router.pathname === path;

  return (
    <>
      {loading && <Loader />} {/* Show loader when loading is true */}

      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>{isAdmin ? 'VisionWorks' : 'Aspire D2D'}</div>
        </div>
        <div className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`} onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`${styles.navLinksContainer} ${menuOpen ? styles.active : ''}`}>
          <ul className={styles.navLinks}>
            {isAdmin ? (
              <>
                <li>
                  <Link href="/admin/addPage" className={`${styles.navLink} ${isActive('/admin/addPage') ? styles.active : ''}`}>Add Page</Link>
                </li>
                <li>
                  <Link href="/admin/uploadImage" className={`${styles.navLink} ${isActive('/admin/uploadImage') ? styles.active : ''}`}>Image Upload</Link>
                </li>
                <li>
                  <Link href="/admin/register" className={`${styles.navLink} ${isActive('/admin/register') ? styles.active : ''}`}>Register</Link>
                </li>
                <li>
                  <Link href="/admin/manageImages" className={`${styles.navLink} ${isActive('/admin/manageImages') ? styles.active : ''}`}>Manage Images</Link>
                </li>
                <li>
                  <Link href="/admin/login" className={`${styles.navLink} ${styles.logoutLink}`} onClick={handleLogout}>Logout</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>Home</Link>
                </li>
                <li>
                  <Link href="/about" className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}>About</Link>
                </li>
                <li>
                  <Link href="/projects" className={`${styles.navLink} ${isActive('/Projects') ? styles.active : ''}`}>Projects</Link>
                </li>
                <li>
                  <Link href="/contact" className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`}>Contact Us</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;