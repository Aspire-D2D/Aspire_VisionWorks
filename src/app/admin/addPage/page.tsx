"use client";
import { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './AddPage.module.css';

export default function AddPage() {
  const [pageName, setPageName] = useState('');
  const [starRatingSelected, setStarRatingSelected] = useState(false);
  const [descriptionSelected, setDescriptionSelected] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/addPage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageName,
        starRatingSelected,
        descriptionSelected,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      Swal.fire({
        title: 'Success!',
        text: 'Page added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        setPageName('');
        setStarRatingSelected(false);
        setDescriptionSelected(false);
      });
      console.log(data);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add the page. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Page</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Page Name Input */}
        <div className={styles.formGroup}>
          <label htmlFor="pageName" className={styles.label}>
            Page Name
          </label>
          <input
            type="text"
            id="pageName"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            placeholder="Enter page name"
            className={styles.input}
            required
          />
        </div>

        {/* Star Rating Checkbox */}
        <div className={styles.formGroupCheckbox}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={starRatingSelected}
              onChange={() => setStarRatingSelected(!starRatingSelected)}
              className={styles.checkbox}
            />
            Star Rating
          </label>
        </div>

        {/* Description Checkbox */}
        <div className={styles.formGroupCheckbox}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={descriptionSelected}
              onChange={() => setDescriptionSelected(!descriptionSelected)}
              className={styles.checkbox}
            />
            Description
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton}>
          Add Page
        </button>
      </form>
    </div>
  );
}
