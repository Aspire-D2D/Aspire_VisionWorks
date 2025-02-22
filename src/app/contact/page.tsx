"use client";
import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/contactUs', formData);
      alert('Your enquiry has been sent successfully!');
      setFormData({ name: '', email: '', service: '', message: '' });
    } catch (error) {
      console.error('Error submitting the form', error);
      alert('There was an issue submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.circle} ${styles.circle1}`}></div>
      <div className={`${styles.circle} ${styles.circle2}`}></div>
      <div className={`${styles.circle} ${styles.circle3}`}></div>
      <div className={`${styles.circle} ${styles.circle4}`}></div>
      <div className={`${styles.circle} ${styles.circle5}`}></div>
      <div className={`${styles.circle} ${styles.circle6}`}></div>
      <section className={styles.infoSection}>
        <p>
          We’re here to help! Whether you need to schedule an appointment, inquire about our services, or get expert advice, our friendly
          team is ready to assist.
        </p>
        <ul className={styles.contactList}>
          <li><FaPhone className={styles.icon} /> <strong>Phone:</strong> (+91) 9876543210</li>
          <li><FaEnvelope className={styles.icon} /> <strong>Email:</strong> info@aspired2d.com</li>
          <li><FaMapMarkerAlt className={styles.icon} /> <strong>Address:</strong> 47, Jayalakshmi Nagar 4th Street, Kattupakkam</li>
          <li><FaClock className={styles.icon} /> <strong>Business Hours:</strong> Monday – Friday: 8:00 AM – 6:00 PM, Saturday: 9:00 AM – 3:00 PM</li>
        </ul>
        <section className={styles.mapSection}>
          <h2>Find Us Here</h2>
          <iframe src="https://www.google.com/maps/embed?pb=..." loading="lazy" width="600" height="200" style={{ border: 0 }}></iframe>
        </section>
      </section>
      <section className={styles.formSection}>
        <h2>We'd Love to Hear From You</h2>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </label>
          <label>
            Service Needed:
            <input type="text" name="service" value={formData.service} onChange={handleInputChange} required />
          </label>
          <label>
            Message:
            <textarea name="message" value={formData.message} onChange={handleInputChange} required></textarea>
          </label>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className={styles.spinner}></div>
            ) : (
              'Go Ahead, Send It'
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
