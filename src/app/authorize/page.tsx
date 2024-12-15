"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Authorize.module.css';
import Cookies from 'js-cookie';

const PasscodePage = () => {
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // To track the loading state
  const [progress, setProgress] = useState(0); // For progress indicator
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
      setIsProcessing(true);
      simulateProcessing();
    } else {
      setErrorMessage('Incorrect passcode. Please try again.');
    }
  };

  const simulateProcessing = () => {
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 20;
      setProgress(progressValue);

      if (progressValue >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        Cookies.set('isAuthorized', 'true', { expires: 1 });
        router.push('/admin/login');
      }
    }, 500);
  };

  return (
    <div className={styles.container}>
      {/* Blurred Shapes for Background Effect */}
      <div className={`${styles.blurredShape} ${styles.blurredShape1}`} />
      <div className={`${styles.blurredShape} ${styles.blurredShape2}`} />
      <div className={`${styles.blurredShape} ${styles.blurredShape3}`} />

      <div className={styles.card}>
        <h2 className={styles.title}>Enter 6-Digit Passcode</h2>
        <div className={styles.securityNotice}>
          <strong>Security Notice:</strong> Please ensure that no one is watching your screen while entering the passcode. If you encounter any issues, please contact support.
        </div>

        <input
          type="password"
          value={passcode}
          onChange={handleInputChange}
          placeholder="Enter passcode"
          maxLength={6}
          className={styles.inputField}
        />
        
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        
        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Submit'}
        </button>

        {isProcessing && (
          <div className={styles.progressIndicator}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className={styles.footer}>
          <p>Forgot your passcode? <span className={styles.forgotPassword}>Click here</span></p>
          <p><a href="/privacy-policy">Privacy Policy</a> | <a href="/support">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

export default PasscodePage;
