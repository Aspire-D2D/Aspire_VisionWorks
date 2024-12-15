"use client"
import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import NextImage from 'next/image';
import styles from "./UploadImage.module.css"


const UploadPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('');
  const [alertImage, setAlertImage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [pageName, setPageName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [pages, setPages] = useState<{ name: string; starRatingEnabled: boolean; descriptionEnabled: boolean }[]>([]);
  const [starRating, setStarRating] = useState(false);
  const [description, setDescription] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [testimonialText, setTestimonialText] = useState('');
  const [pageIdentity, setPageIdentity] = useState('');
  const [pageNameError, setPageNameError] = useState('');
  const [imageValidationError, setImageValidationError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');

      if (!token) {
        await Swal.fire({
          title: 'Not Logged In',
          text: 'You are not logged in. Redirecting to the login page...',
          icon: 'warning',
          confirmButtonText: 'OK',
          allowOutsideClick: false, 
        });

        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        } else {
          setLoading(false);
        }
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.role === 'admin') {
          setIsAdmin(true);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(true);
          router.push('/not-authorized');
        }
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get('/api/addPage');
        setPages(response.data);
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchPages();
    }
  }, [isAuthenticated, isAdmin]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
  
    if (file && !file.type.startsWith("image/")) {
      Swal.fire({
        title: "Invalid File Type",
        text: "Only image files are allowed.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  
    if (file) {
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      setImageName(nameWithoutExtension); 
  
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    
      handleFileSelection(file);
    }
  };
  
  const handleFileSelection = (file: File | null) => {
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePageNameChange = async  (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPage = e.target.value;
    setPageName(selectedPage);
    setPageNameError(''); 
    
    const selectedPageDetails = pages.find((page) => page.name === selectedPage);
    
    if (selectedPageDetails) {
      setStarRating(selectedPageDetails.starRatingEnabled);
      setDescription(selectedPageDetails.descriptionEnabled);
    }

    if (selectedPage) {
      try {
        const response = await axios.get(`/api/pageIdentity?pageName=${selectedPage}`);
        const availableIdentities = response.data.identities;
        setPageIdentity(availableIdentities.length ? availableIdentities[0] : ''); 
      } catch (error) {
        console.error('Error fetching page identity:', error);
      }
    }
  };

  const handleImageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name = e.target.value;
    name = name.replace(/\.[^/.]+$/, '');
    console.log("Image Name", name);
    setImageName(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!image && !imageUrl) {
      setImageValidationError('Please upload an image.');
      return;
    } else {
      setImageValidationError(null);
    }

    if (!pageName || !pageIdentity) {
      setPageNameError('Page Name and Identity are mandatory');
      return;
    }

    // Log the values for debugging
    console.log('Submitting Form:');
    console.log('Page Name:', pageName);
    console.log('Page Identity:', pageIdentity);
  
    setLoading(true);
    setAlertImage(null);
  
    const formData = new FormData();
    
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken;
      console.log("User Id is:", userId);
      // formData.append('user_id', userId);
    }

    if (image) {
      const fileExtension = image.name.split('.').pop() || 'jpeg';
      let fullImageName = imageName;
  
      if (!fullImageName.toLowerCase().endsWith(`.${fileExtension}`)) {
        fullImageName = `${fullImageName}.${fileExtension}`; 
      }
  
      formData.append('image', image);
      formData.append('image_name', fullImageName); 
    }
  
    if (imageUrl) {
      formData.append('image_url', imageUrl);
    }
  
    if (pageName) {
      formData.append('page_name', pageName);
    }
    if (pageIdentity) {
      formData.append('identity', pageIdentity); // Add page identity to the form data
    }
    if (starRating) {
      formData.append('star_rating', ratingValue.toString());
    }
    if (testimonialText) {
      formData.append('testimonial_text', testimonialText);
    }
  
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus(response.data.message);
      setAlertImage('/path/to/success-image.png');
  
      Swal.fire({
        title: 'Success!',
        text: 'Image uploaded successfully!',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
      });
  
      setImage(null);
      setImageUrl('');
      setPageName('');
      setPageIdentity('');
      setStarRating(false);
      setDescription(false);
      setRatingValue(0);
      setTestimonialText('');
      setImagePreview(null);
      setImageName(''); 
    } catch (error) {
      console.log(error);
      setStatus('Error uploading image.');
      setAlertImage('/path/to/error-image.png');
      Swal.fire({
        title: 'Error!',
        text: 'There was an issue uploading the image.',
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className={styles.spinner}>
        <div className={styles.loader}>Uploading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <p>Redirecting...</p>;
  }

  return (
    <div className={styles.container}>
  <h1 className={styles.title}>Upload an Image</h1>
  
  <div className={styles.dropzone} onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}>
    <div className={styles.icon}>
      <img src="../ImageUpload.svg" alt="Upload Icon" width={40} height={40} />
    </div>
    <p className={styles.instruction}>
      Drag & drop files or <span className={styles.browse}  onClick={() => document.getElementById('fileInput')?.click()}>Browse</span>
    </p>
    <p className={styles.supportedFormats}>
      Supported formats: JPEG, PNG, etc.
    </p>
    <input
    type="file"
    id="fileInput"
    accept="image/*" // Restrict to image files
    onChange={handleFileChange}
    className={styles.fileInput}
  />
  </div>

  <form onSubmit={handleSubmit} className={styles.form}>
    <div className={styles.formGroup}>
      <label className={styles.label}>Image Name</label>
      <input
        type="text"
        value={imageName}
        onChange={handleImageNameChange}
        placeholder="Enter a custom name for the image"
        className={styles.input}
      />
          {imageValidationError && (
      <span className={styles.error}>
        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', color: 'red' }}>
          error
        </span>
        {imageValidationError}
      </span>
    )}
    </div>

    <div className={styles.formGroup}>
      <label className={styles.label}>Page Name</label>
      <select
        value={pageName}
        onChange={handlePageNameChange}
        className={styles.select}
      >
        <option value="">Select a page</option>
        {pages.map((page, index) => (
          <option key={index} value={page.name}>
            {page.name}
          </option>
        ))}
      </select>
      {pageNameError && (
    <span className={styles.error}>
      <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', color: 'red' }}>
        error
      </span>
      {pageNameError}
    </span>
  )}
</div>
{/* Page Identity Dropdown */}
{pageName && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Page Identity</label>
            <select
              value={pageIdentity}
              onChange={(e) => setPageIdentity(e.target.value)}
              className={styles.select}
            >
              <option value="">Select Identity</option>
              <option value="hero">Hero</option>
              <option value="banner">Banner</option>
              <option value="testimonial">Testimonial</option>
              {/* Add other options as required */}
            </select>
          </div>
        )}

    {starRating && (
      <div className={styles.formGroup}>
        <label className={styles.label}>Star Rating</label>
        <div className={styles.rating}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating}>
              <input
                type="radio"
                name="star_rating"
                value={rating}
                checked={rating === ratingValue}
                onChange={() => setRatingValue(rating)}
              />
              {rating} Star{rating > 1 && "s"}
            </label>
          ))}
        </div>
      </div>
    )}

    {description && (
      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          value={testimonialText}
          onChange={(e) => setTestimonialText(e.target.value)}
          placeholder="Enter description"
          className={styles.textarea}
        />
      </div>
    )}

    <button type="submit" className={styles.uploadButton}>
      Upload
    </button>
  </form>

  {status && <p className={styles.status}>{status}</p>}

  <div className={styles.preview}>
  <h3 className={styles.previewTitle}>Image Preview:</h3>
{imagePreview ? (
  <NextImage
    src={imagePreview}
    alt="Image preview"
    width={300}
    height={200}
    style={{ maxWidth: "100%", height: "auto" }}
  />
) : (
  <p className={styles.noPreview}>No preview available.</p>
)}
</div>
</div>

  );
};

export default UploadPage;
