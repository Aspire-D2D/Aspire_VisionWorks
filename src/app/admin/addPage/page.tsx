"use client";
import { useState } from 'react';
import Swal from 'sweetalert2';

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
    <div>
      <h1>Add New Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Page Name</label>
          <input
            type="text"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={starRatingSelected}
              onChange={() => setStarRatingSelected(!starRatingSelected)}
            />
            Star Rating
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={descriptionSelected}
              onChange={() => setDescriptionSelected(!descriptionSelected)}
            />
            Description
          </label>
        </div>

        <button type="submit">Add Page</button>
      </form>
    </div>
  );
}
