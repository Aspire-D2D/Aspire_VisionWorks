"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Authorize.module.css';
import Cookies from 'js-cookie'; // Import js-cookie to manage cookies

const PasscodePage = () => {
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (/^\d*$/.test(value) && value.length <= 6) {
      setPasscode(value);
    }
  };

  const handleSubmit = () => {
    const correctPasscode = '123456';

    if (passcode === correctPasscode) {
      Cookies.set('isAuthorized', 'true', { expires: 1 });
      router.push('/admin/login');
    } else {
      setErrorMessage('Incorrect passcode. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Enter 6-Digit Passcode</h2>
        <input
          type="text"
          value={passcode}
          onChange={handleInputChange}
          placeholder="Enter passcode"
          maxLength={6}
          className={styles.inputField} // Apply the input style
        />
        <div className={styles.errorMessage}>{errorMessage}</div>
        <button
          onClick={handleSubmit}
          className={styles.submitButton} // Apply the button style
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PasscodePage;
