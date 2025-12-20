import React, { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { motion, Variants } from 'framer-motion';

import styles from './index.module.css';
import Chatbot from '../components/ChatWidget';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.06 },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const underlineVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.9, ease: 'easeInOut' } },
};

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const bookCoverImageSrc = useBaseUrl('/img/AUTHOR.png');
  const bookCoverImageSrc1 = useBaseUrl('/img/HERO_SECTION.png');
  
  const futurePlans = [
    { title: "Multi-volume series", description: "Expand the single volume into a structured multi-volume curriculum.", icon: "📚" },
    { title: "Interactive 3D models", description: "Embed WebGL/three.js models of robot hardware and joints.", icon: "🧊" },
    { title: "AI-powered robotics simulations", description: "Cloud-run simulations with real-time telemetry & scenario playback.", icon: "🤖" },
    { title: "Hands-on lab tutorials", description: "Step-by-step labs with downloadable code and prebuilt Docker images.", icon: "🔧" },
    { title: "Publish research & case studies", description: "Curated academic and industry research with open data.", icon: "📄" },
    { title: "Robotics learning platform", description: "Community courses, leaderboards, and capstone projects.", icon: "👥" },
  ];

  const whyMatters = [
    { title: "Physical AI Foundations", description: "Dive deep into the core concepts that bridge AI and physical systems.", icon: "🧠" },
    { title: "Humanoid Robotics Concepts", description: "Explore sensors, actuators, and kinematics for human-like robots.", icon: "⚙️" },
    { title: "Practical Applications", description: "Apply knowledge to real-world industries like healthcare and manufacturing.", icon: "🏭" },
  ];

  const whatLearn = [
    { text: "AI + Robotics Integration", icon: "🧠" },
    { text: "Advanced Motor Control", icon: "🦾" },
    { text: "Sensor Fusion Techniques", icon: "👁️" },
    { text: "Machine Learning for Robotics", icon: "🤖" },
    { text: "Ethical AI in Physical Systems", icon: "⚖️" },
    { text: "Simulation and Prototyping", icon: "💻" },
  ];

  return (
    <Layout
      title={`Explore ${siteConfig.title}`}
      description="Master Physical AI & Humanoid Robotics with cutting-edge insights and practical guidance.">
      
      
      {/* SECTION 1 — HERO SECTION */}
      <header className={clsx('hero', styles.heroSection)}>
        <div className="container">
          <div className="row">
            {/* Left: Book Mockup */}
            <motion.div 
              className={clsx('col col--6', styles.heroLeft)}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.bookMockup3DGallery}>
                                <img
                                  src={bookCoverImageSrc1}
                                  alt="Book Cover"
                                  className={styles.bookCoverImage}
                                />
                              </div>
                            </motion.div>
                
                            {/* Right: Content */}
                            <motion.div
                              className={clsx('col col--6', styles.heroRight)}
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            >
                              <Heading as="h1" className={styles.heroTitle}>
                                Physical AI & Humanoid Robotics
                              </Heading>
                              <p className={styles.heroSubtitle}>
                                Master the principles, simulations, and real-world building blocks to create intelligent humanoid systems.
                              </p>
                                <div className={styles.authorInfo}>
                                  <img src={bookCoverImageSrc} alt="Author Avatar" className={styles.authorAvatar} />                  <span className={styles.authorName}>By Muhammad Suleman</span>
                </div>
              <div className={styles.badge}>Full-Stack AI Developer • Robotics Learner</div>
              
              <div className={styles.heroCTAs}>
                <Link
                  className={clsx('button button--lg', styles.heroCTA, styles.primaryCTA)}
                  to="/docs/intro"
                >
                  📖 Start Reading
                </Link>
                <Link
                  className={clsx('button button--lg', styles.heroCTA, styles.secondaryCTA)}
                  to="/docs/intro"
                >
                  🌐 Explore More Books
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main>
        {/* SECTION 2 — FUTURE PLAN & VISION */}
        <section className={styles.futurePlanSection}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headingVariants}
              className={clsx('text--center', styles.headingWrapper)}
            >
              <Heading as="h2" className={styles.sectionTitle}>
                {"🚀 Future Plan & Vision".split("").map((char, index) => (
                  <motion.span key={index} variants={letterVariants}>
                    {char}
                  </motion.span>
                ))}
              </Heading>
              <motion.div
                className={styles.underline}
                variants={underlineVariants}
              />
            </motion.div>
            <motion.div
              className={styles.planGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {futurePlans.map((plan, idx) => (
                <motion.div
                  key={idx}
                  className={styles.planItem}
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <div className={styles.planIcon}>{plan.icon}</div>
                  <h3>{plan.title}</h3>
                  <p>{plan.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
         <div>
          <Chatbot/>
          </div>     
        {/* SECTION 3 — WHY THIS BOOK MATTERS */}
        <section className={styles.whyThisBookSection}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headingVariants}
              className={clsx('text--center', styles.headingWrapper)}
            >
              <Heading as="h2" className={styles.sectionTitle}>
                {"🤖 Why This Book Matters".split("").map((char, index) => (
                  <motion.span key={index} variants={letterVariants}>
                    {char}
                  </motion.span>
                ))}
              </Heading>
              <motion.div
                className={styles.underline}
                variants={underlineVariants}
              />
            </motion.div>
            <motion.div
              className={styles.featuresGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {whyMatters.map((item, idx) => (
                <motion.div
                  key={idx}
                  className={styles.featureCard}
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <div className={styles.featureIcon}>{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SECTION 4 — WHAT YOU WILL LEARN */}
        <section className={styles.whatYouWillLearnSection}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headingVariants}
              className={clsx('text--center', styles.headingWrapper)}
            >
              <Heading as="h2" className={styles.sectionTitle}>
                {"📚 What You Will Learn".split("").map((char, index) => (
                  <motion.span key={index} variants={letterVariants}>
                    {char}
                  </motion.span>
                ))}
              </Heading>
              <motion.div
                className={styles.underline}
                variants={underlineVariants}
              />
            </motion.div>
            <motion.div
              className={styles.learnGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {whatLearn.map((item, idx) => (
                <motion.div
                  key={idx}
                  className={styles.learnGridItem}
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <div className={styles.learnIcon}>{item.icon}</div>
                  <p>{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SECTION 5 — CALL TO ACTION */}
        <section className={styles.callToActionSection}>
          <div className="container text--center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headingVariants}
            >
              <Heading as="h2" className={styles.sectionTitle}>
                {"🔥 Ready to Start Your Robotics Journey?".split("").map((char, index) => (
                  <motion.span key={index} variants={letterVariants}>
                    {char}
                  </motion.span>
                ))}
              </Heading>
            </motion.div>
            <Link
              className={clsx('button button--lg', styles.callToActionButton)}
              to="/docs/intro"
            >
              Start Reading Now
            </Link>
          </div>
        </section>

        {/* SECTION 6 — EXTRA SECTIONS */}
       {/* EXTRA SECTIONS — PREMIUM EXPERIENCE */}
<section className={styles.extraSections}>
  <div className="container">

    {/* ⭐ TESTIMONIALS — GLASS GRID */}
    <motion.section
      className={styles.modernSection}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Heading as="h2" className={styles.modernTitle}>
        ❤️ Voices From Our Readers
      </Heading>

      <p className={styles.sectionSubtitle}>
        Real experiences from those inspired by this journey into robotics & AI.
      </p>

      <div className={styles.grid3}>
        {[
          { text: "A masterpiece in robotics education.", user: "Reader A", rating: "★★★★★" },
          { text: "An eye-opening journey into future AI.", user: "Reader B", rating: "★★★★★" },
          { text: "Deep, practical and visionary.", user: "Reader C", rating: "★★★★★" }
        ].map((item, index) => (
          <motion.div 
            key={index} 
            className={styles.testimonialCard}
            whileHover={{ scale: 1.05 }}
          >
            <p className={styles.testimonialText}>"{item.text}"</p>
            <span className={styles.testimonialUser}>– {item.user}</span>
            <div className={styles.rating}>{item.rating}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>


    {/* ⭐ ABOUT AUTHOR — PREMIUM PROFILE */}
    <motion.section
      className={styles.modernSection}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <Heading as="h2" className={styles.modernTitle}>
        👨‍💻 Meet the Author — Muhammad Suleman
      </Heading>

      <div className={styles.aboutAuthor}>
        <motion.img
          src={bookCoverImageSrc}
          alt="Author"
          className={styles.authorPhoto}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.3 }}
        />

        <div>
          <p className={styles.authorBio}>
            Muhammad Suleman is a passionate full-stack AI developer, robotics
            enthusiast, and educator committed to shaping the future through
            technology. His work blends innovation, clarity, and purpose.
          </p>

          <p className={styles.authorBio}>
            With a deep love for creating AI systems and empowering learners,
            he aims to make advanced robotics accessible to everyone.
          </p>
        </div>
      </div>
    </motion.section>


    {/* ⭐ COMMUNITY — HEART-TOUCHING CTA */}
    <motion.section
      className={styles.modernSection}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4 }}
    >
      <Heading as="h2" className={styles.modernTitle}>
        🤝 Join Our Robotics Family
      </Heading>

      <p className={styles.sectionSubtitleCenter}>
        Be part of a warm, passionate community learning the future together.
      </p>

      <div className={styles.newsletterForm}>
        <input
          type="email"
          placeholder="Enter your email & join the movement"
          className={styles.newsletterInput}
        />
        <button className={clsx("button", styles.newsletterButton)}>Subscribe ✨</button>
      </div>

      <p className={styles.smallNote}>
        No spam. Only pure robotics & AI wisdom.
      </p>
    </motion.section>

  </div>
</section>

      </main>

      {/* SECTION 7 — FOOTER */}
      {/* <footer className={styles.modernFooter}>
        <div className="container">
          <div className="row">
            <div className="col col--4">
              <div className={styles.footerBrand}>
                <img src={imageUrl} alt="Book Logo" className={styles.footerLogo} />
                <span className={styles.footerBookName}>Physical AI & Humanoid Robotics</span>
              </div>
            </div>
            <div className="col col--4">
              <div className={styles.footerLinks}>
                <h4>Navigation</h4>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/docs/intro">Books</Link></li>
                </ul>
              </div>
            </div>
            <div className="col col--4">
              <div className={styles.footerSocials}>
                <h4>Connect With Us</h4>
                <div className={styles.socialIcons}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <img src={imageUrl} alt="Social Icon" className={styles.socialIcon} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footerCopyright}>
            Copyright © {new Date().getFullYear()} Physical AI & Humanoid Robotics.
          </div>
        </div>
      </footer> */}
    </Layout>
  );
}