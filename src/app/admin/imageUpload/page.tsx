"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Image from "next/image";

const UploadForm = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);  // Initially loading
  const [pageName, setPageName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [pages, setPages] = useState<{ name: string; starRatingEnabled: boolean; descriptionEnabled: boolean }[]>([]);
  const [starRating, setStarRating] = useState(false);
  const [description, setDescription] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [testimonialText, setTestimonialText] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");

      if (!token) {
        await Swal.fire({
          title: "Not Logged In",
          text: "You are not logged in. Redirecting to the login page...",
          icon: "warning",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        } else {
          setLoading(false);  // Stop loading if already on login page
        }
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        if (decodedToken.role === "admin") {
          setIsAdmin(true);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(true);
          router.push("/not-authorized");
        }
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        router.push("/admin/login");
      } finally {
        setLoading(false);  // Stop loading when auth check is done
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Fetch pages after authentication
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const fetchPages = async () => {
        try {
          const response = await axios.get("/api/addPage");
          setPages(response.data);
        } catch (error) {
          console.error("Error fetching pages:", error);
        }
      };
      fetchPages();
    }
  }, [isAuthenticated, isAdmin]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageUrl(''); // Clear image URL preview if an image file is selected
      setImageName(file.name); // Ensure the image name is set correctly with extension
    } else {
      setImagePreview(null);
    }
  };

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);

    if (url) {
      setImagePreview(url);
      setImage(null); // Clear image file preview if an image URL is entered
    } else {
      setImagePreview(null);
    }
  };

  const handlePageNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedPage = e.target.value;
    setPageName(selectedPage);

    const selectedPageDetails = pages.find((page) => page.name === selectedPage);

    if (selectedPageDetails) {
      setStarRating(selectedPageDetails.starRatingEnabled);
      setDescription(selectedPageDetails.descriptionEnabled);
    }
  };

  const handleImageNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageName(e.target.value); // Handle image name input change
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log("Image:", image);
    console.log("Image URL:", imageUrl);

    setLoading(true);

    const formData = new FormData();

    // Handle image file
    if (image) {
      const fileExtension = image.name.split(".").pop() || "jpeg"; // Default to jpeg if no extension
      let fullImageName = imageName;

      if (!fullImageName.toLowerCase().endsWith(`.${fileExtension}`)) {
        fullImageName = `${imageName}.${fileExtension}`; // Combine name with extension
      }

      formData.append("file", image); // Change to match the server-side code
      formData.append("image_name", fullImageName); // Include full image name with extension
    }

    // Handle image URL
    if (imageUrl) {
      formData.append("image_url", imageUrl);
    }

    // Other form data
    if (pageName) {
      formData.append("page_name", pageName);
    }
    if (starRating) {
      formData.append("star_rating", ratingValue.toString());
    }
    if (testimonialText) {
      formData.append("testimonial_text", testimonialText);
    }

    try {
      const response = await axios.post("/api/s3-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(response.data.message);

      Swal.fire({
        title: "Success!",
        text: "Image uploaded successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });

      // Reset the form after successful upload
      setImage(null);
      setImageUrl("");
      setPageName("");
      setStarRating(false);
      setDescription(false);
      setRatingValue(0);
      setTestimonialText("");
      setImagePreview(null);
      setImageName(""); // Reset image name
    } catch (error) {
      console.log(error);
      setStatus("Error uploading image.");

      Swal.fire({
        title: "Error!",
        text: "There was an issue uploading the image.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setLoading(false); // Set loading to false after upload is complete (success or failure)
    }
};


  if (loading) {
    return (
      <div>
        <h1>Uploading...</h1>
        <div className="spinner">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
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
            onChange={handleImageUrlChange}
            placeholder="Enter image URL"
          />
        </div>
        <div>
          <label>Image Name</label>
          <input
            type="text"
            value={imageName}
            onChange={handleImageNameChange}
            placeholder="Enter a custom name for the image"
          />
        </div>
        <div>
          <label>Page Name</label>
          <select value={pageName} onChange={handlePageNameChange}>
            <option value="">Select a page</option>
            {pages.length > 0 ? (
              pages.map((page, index) => (
                <option key={index} value={page.name}>
                  {page.name}
                </option>
              ))
            ) : (
              <option disabled>No pages available</option>
            )}
          </select>
        </div>

        {starRating && (
          <div>
            <label>Star Rating</label>
            <div>
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
          <div>
            <label>Description</label>
            <textarea
              value={testimonialText}
              onChange={(e) => setTestimonialText(e.target.value)}
              placeholder="Enter description"
            />
          </div>
        )}

        <button type="submit">Upload</button>
      </form>

      {status && <p>{status}</p>}

      <div>
        <h3>Image Preview</h3>
        {imagePreview && (
          <Image src={imagePreview} alt="Preview" style={{ maxWidth: "100%" }} />
        )}
      </div>
    </div>
  );
};

export default UploadForm;
