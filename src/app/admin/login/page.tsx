'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from "./AdminLogin.module.css";

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Token received:', data.token);
        Cookies.set('token', data.token, { expires: 1 });
        router.push('/admin/uploadImage');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error encountered in handleLogin function:', err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      console.log('Token found in cookies:', token);
      router.push('/admin/uploadImage');
    } else {
      console.log('No token found in cookies');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <img src="/secure_login.svg" alt="Illustration" className={styles.illustration} />
      </div>
      <div className={styles.rightSection}>
        <h1>Login as a Admin User</h1>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <input
              type="email"
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
        <div className={styles.links}>
          <a href="#">Forget your password?</a>
          <a href="#">Get help Signed in.</a>
        </div>
        <div className={styles.footer}>
          <p>Terms of use. Privacy policy</p>
        </div>
      </div>
    </div>
  );
}
