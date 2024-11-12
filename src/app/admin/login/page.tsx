'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Type annotation
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
    const token = Cookies.get('token'); // Retrieve token from cookies
    if (token) {
      console.log('Token found in cookies:', token); // Log the token
      router.push('/admin/uploadImage');
    } else {
      console.log('No token found in cookies'); // Log the absence of token
    }
  }, [router]);

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
