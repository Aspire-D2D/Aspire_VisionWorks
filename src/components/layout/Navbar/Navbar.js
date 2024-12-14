"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
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


  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>VisionWorks</div>
      <ul className={styles.navLinks}>
        {isAdmin ? (
          <>
            <li>
              <Link href="/admin/addPage" className={styles.navLink}>
                Add Page
              </Link>
            </li>
            <li>
              <Link href="/admin/uploadImage" className={styles.navLink}>
                Image Upload
              </Link>
            </li>
            <li>
              <Link href="/admin/register" className={styles.navLink}>
                Register
              </Link>
            </li>
            <li>
              <Link href="/admin/manageImages" className={styles.navLink}>
                Manage Images
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/contact" className={styles.navLink}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;