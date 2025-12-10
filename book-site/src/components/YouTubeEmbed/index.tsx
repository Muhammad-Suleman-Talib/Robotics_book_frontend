import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title, className }) => {
  if (!videoId) {
    return (
      <div className={clsx(styles.youTubeEmbedContainer, styles.youTubeEmbedError, className)}>
        <span>Error: YouTube video ID is missing.</span>
      </div>
    );
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

  return (
    <div className={clsx(styles.youTubeEmbedContainer, className)}>
      <iframe
        className={styles.youTubeIframe}
        src={embedUrl}
        title={title || `YouTube video player for ID: ${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy" // Lazy load the iframe
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
