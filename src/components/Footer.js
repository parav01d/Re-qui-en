import React from 'react'
import styles from './Footer.module.scss'
import config from '../../data/SiteConfig'

const Footer = () => (
  <footer>
    <div className={styles.container}>
      <div>
        <a
          styles={{color: "#fff"}}
          href={`https://github.com/${config.userGitHub}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
      <div className={styles.copyright}>{config.copyright}</div>
      <div className={styles.logo}>
        <div className={`${styles.rec  } ${  styles.rec1}`} />
        <div className={`${styles.rec  } ${  styles.rec2}`} />
        <div className={`${styles.rec  } ${  styles.rec3}`} />
        <div className={`${styles.rec  } ${  styles.rec4}`} />
        <div className={`${styles.rec  } ${  styles.rec5}`} />
      </div>
    </div>
  </footer>
  )


export default Footer
