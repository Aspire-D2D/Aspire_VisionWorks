'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

const UploadPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token'); // Retrieve token from cookies

      // If no token and not already on login page, redirect to login
      if (!token) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        } else {
          setLoading(false);
        }
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding JWT to get user info
        if (decodedToken.role === 'admin') {
          setIsAdmin(true);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(true);
          router.push('/not-authorized');
        }
      } catch (error) {
        // Handle invalid or corrupted token
        setIsAuthenticated(false);
        router.push('/admin/login');
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }
    if (imageUrl) {
      formData.append('image_url', imageUrl);
    }

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus(response.data.message);
    } catch (error) {
      setStatus('Error uploading image.');
    }
  };

  // While the authentication check is loading, display a loading message
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <p>Redirecting...</p>;
  }

  return (
    <div>
      <h1>Upload an Image</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Image File</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <label>Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
        <button type="submit">Upload</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
};

export default UploadPage;
