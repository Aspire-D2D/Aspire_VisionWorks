import { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './styles/AdminRegisterForm.module.css'; // Import the new CSS

export default function AdminRegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const promptForSecretPassword = () => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: 'Enter Admin Secret Password',
        input: 'password',
        inputLabel: 'Please enter your secret password',
        inputPlaceholder: 'Admin password',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        preConfirm: (password) => {
          if (password) {
            resolve(password);
          } else {
            reject('Password is required');
          }
        },
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const secretPassword = await promptForSecretPassword();

      // If secret password is correct, proceed with registration
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, secretPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Registration Successful!',
          text: data.message,
          icon: 'success',
        }).then(() => {
          onSuccess();
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.message,
          icon: 'error',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to verify admin password',
        icon: 'error',
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      {/* <h1 className={styles.formTitle}>Admin Registration</h1> */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Register Admin</button>
      </form>
    </div>
  );
}
