"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminRegisterForm from '../../../components/forms/AdminRegisterForm';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import styles from './RegisterPage.module.css'; // Importing the CSS module

export default function RegisterPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { isLoggedIn, isAdmin } = checkIfUserIsLoggedIn();

  useEffect(() => {
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Not Logged In',
        text: 'You are not logged in. You will be redirected to the login page.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      }).then(() => {
        router.push('/admin/login');
      });
    } else if (!isAdmin) {
      router.push('/not-authorized');
      setIsRedirecting(true);
    }
  }, [isLoggedIn, isAdmin, router]);

  if (isRedirecting) {
    return null;
  }

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/admin/login');
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Registration</h1>
      <div className={styles.formContainer}>
        <AdminRegisterForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

function checkIfUserIsLoggedIn() {
  const token = Cookies.get('token');
  if (!token) return { isLoggedIn: false, isAdmin: false };

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return {
      isLoggedIn: true,
      isAdmin: decodedToken.role === 'admin',
    };
  } catch (error) {
    console.log(error);
    return { isLoggedIn: false, isAdmin: false };
  }
}
