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
      <section className={styles.infoSection}>
        <h2>We’re Here to Help</h2>
        <p>
          Whether you need to schedule an appointment, inquire about our services, or get expert advice, our friendly team is ready to assist.
        </p>
        <ul className={styles.contactList}>
          <li><FaPhone className={styles.icon} /> <strong>Phone:</strong> (+91) 9876543210</li>
          <li><FaEnvelope className={styles.icon} /> <strong>Email:</strong> info@aspired2d.com</li>
          <li><FaMapMarkerAlt className={styles.icon} /> <strong>Address:</strong> 47, Jayalakshmi Nagar 4th Street, Kattupakkam</li>
          <li><FaClock className={styles.icon} /> <strong>Business Hours:</strong> Monday – Friday: 8:00 AM – 6:00 PM, Saturday: 9:00 AM – 3:00 PM</li>
        </ul>
        <div className={styles.mapSection}>
          <h2>Find Us Here</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=..."
            loading="lazy"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: '10px' }}
          ></iframe>
        </div>
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