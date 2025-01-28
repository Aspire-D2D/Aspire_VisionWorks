"use client"
import Head from 'next/head';
import styles from './About.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faUserCheck, faStar, faHandshake } from '@fortawesome/free-solid-svg-icons';

const features = [
  {
    icon: faTools,
    title: "Advanced Equipment",
    description: "We use state-of-the-art tools and technology to deliver your projects."
  },
  {
    icon: faUserCheck,
    title: "Certified Professionals",
    description: "Our team comprises highly skilled, certified experts."
  },
  {
    icon: faStar,
    title: "Personalized Service",
    description: "Tailored solutions to meet your specific needs."
  },
  {
    icon: faHandshake,
    title: "Proven Track Record",
    description: "With countless satisfied customers, our commitment to quality speaks for itself."
  }
];

const teamMembers = [
  {
    name: "John Smith",
    role: "Lead Developer",
    experience: "15 years of experience in web technologies.",
    image: "/john-smith.jpg",
  },
  {
    name: "Lisa Brown",
    role: "Project Manager",
    experience: "Ensuring every client receives the best service experience.",
    image: "/lisa-brown.jpg",
  },
  {
    name: "Tom Lee",
    role: "Senior Designer",
    experience: "Specializing in user experience and interface design.",
    image: "/tom-lee.jpg",
  },
  {
    name: "Chris Evan",
    role: "Junior Designer",
    experience: "A fresh perspective on user experience and interface design.",
    image: "/chris-evans.jpg",
  },
];

export default function About() {
  const scrollToTeamSection = () => {
    const teamSection = document.getElementById('teamSection');
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>About Us - Aspire D2D</title>
        <meta name="description" content="Learn more about Aspire D2D, your creative ally." />
      </Head>
      <div className={`${styles.circle} ${styles.circle1}`}></div>
      <div className={`${styles.circle} ${styles.circle2}`}></div>
      <div className={`${styles.circle} ${styles.circle3}`}></div>
      <div className={`${styles.circle} ${styles.circle4}`}></div>
      <div className={`${styles.circle} ${styles.circle5}`}></div>
      <div className={`${styles.circle} ${styles.circle6}`}></div>
      <section id="featuresSection" className={styles.featuresSection}>
        <h1 className={styles.title}>Why Choose Us</h1>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <FontAwesomeIcon icon={feature.icon} className={styles.icon} />
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
        {/* <button className={styles.teamButton} onClick={scrollToTeamSection}>Meet the Team</button> */}
      </section>
      <section id="teamSection" className={styles.teamSection}>
        <h2 className={styles.subtitle}>Meet the Team</h2>
        <div className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <div key={member.name} className={styles.teamMember}>
              <img src={member.image} alt={`${member.name}'s profile`} className={styles.memberImage} />
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}><strong>{member.role}</strong></p>
              <p className={styles.memberExperience}>{member.experience}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}