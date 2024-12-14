'use client';
import { useEffect, useState } from 'react';
import styles from "./ManageImage.module.css"

const manageImages = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const deleteImage = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`/api/manage-images/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        alert('Image deleted successfully');
        fetchImages();  // Refresh the images list
      } else {
        console.error('Failed to delete image:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/manage-images', { method: 'GET' });
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Sort images by 'id' in ascending order
        const sortedImages = data.sort((a, b) => a.id - b.id);
        setImages(sortedImages);
      } else {
        console.error('Expected an array but received:', data);
        setImages([]);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);  // Default to empty array on error
    }
    setLoading(false);
  };

  const updateStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch('/api/manage-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        alert(`Status updated to ${newStatus}`);
        fetchImages();
      } else {
        console.error('Failed to update status:', await response.text());
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Images</h1>
      {loading ? (
        <p className={styles.loadingText}>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Image Name</th>
              <th>Page Name</th>
              <th>Testimonial</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => (
              <tr key={image.id}>
                <td>{image.id}</td>
                <td>{image.user_id ?? 'N/A'}</td>
                <td>{image.image_name || 'N/A'}</td>
                <td>{image.page_name || 'N/A'}</td>
                <td>{image.testimonial_text || 'No Testimonial'}</td>
                <td>{image.star_rating || 'N/A'}</td>
                <td>{image.status}</td>
                <td>
                  <button
                    className={`${styles.statusBtn} ${image.status === 'active' ? styles.active : styles.inactive}`}
                    onClick={() => updateStatus(image.id, image.status)}
                  >
                    <span className="material-icons">{image.status === 'active' ? 'power_settings_new' : 'power_off'}</span>
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteImage(image.id)}
                  >
                    <span className="material-icons">delete_forever</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default manageImages;
