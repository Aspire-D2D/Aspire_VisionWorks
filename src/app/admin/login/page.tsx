'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import styles from './AdminLogin.module.css';

const toastSettings = {
  position: 'top-right' as ToastPosition,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

const ResetPasswordModal = ({ email, onClose }: { email: string; onClose: () => void }) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successfully!', toastSettings);
        onClose();
      } else {
        toast.error(data.message || 'Failed to reset password', toastSettings);
      }
    } catch (err) {
      toast.error('Something went wrong', toastSettings);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Enter OTP and New Password</h2>
        <input
          type="text"
          className={styles.inputField}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <input
          type="password"
          className={styles.inputField}
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button onClick={handleResetPassword} disabled={loading} className={styles.modalButton}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button onClick={onClose} className={styles.modalButton}>Cancel</button>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        Cookies.set('token', data.token, { expires: 1 });
        router.push('/admin/uploadImage');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('OTP sent successfully!', toastSettings);
        setIsForgotPassword(true); // Show modal for password reset
      } else {
        toast.error(data.message || 'Failed to send OTP', toastSettings);
      }
    } catch (err) {
      toast.error('Something went wrong', toastSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      router.push('/admin/uploadImage');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <img src="/secure_login.svg" alt="Illustration" className={styles.illustration} />
      </div>
      <div className={styles.rightSection}>
        <h1>Login as an Admin User</h1>
        {isForgotPassword ? (
          <ResetPasswordModal email={email} onClose={() => setIsForgotPassword(false)} />
        ) : (
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                className={styles.inputField}
                placeholder="johndoe@xyz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className={styles.icon}>
                <i className="fa fa-user" />
              </span>
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                className={styles.inputField}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className={styles.icon}>
                <i className="fa fa-lock" />
              </span>
            </div>
            <button type="submit" className={styles.loginButton}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </form>
        )}
        <div className={styles.links}>
          {!isForgotPassword && <a href="#" onClick={handleForgotPassword}>Forgot your password?</a>}
          <a href="#">Get help Signed in.</a>
        </div>
        <div className={styles.footer}>
          <p>Terms of use. Privacy policy</p>
        </div>
      </div>
      <ToastContainer {...toastSettings} />
    </div>
  );
};

export default AdminLogin;
