import React from 'react'
import { Link } from "gatsby";
import config from '../../data/SiteConfig';
import Categories from './Categories'
import styles from './Header.module.scss'

const Header = () => (
  <header>
    <nav>
      <ul className={styles.mainNav}>
        <Categories activeClassName={styles.activeNav} />
        <li>
          <Link to="/about" activeClassName={styles.activeNav}>About</Link>
        </li>
      </ul>
    </nav>
    <Link to="/">
      <div className={styles.logo}>
        <div className={`${styles.rec  } ${  styles.rec1}`} />
        <div className={`${styles.rec  } ${  styles.rec2}`} />
        <div className={`${styles.rec  } ${  styles.rec3}`} />
        <div className={`${styles.rec  } ${  styles.rec4}`} />
        <div className={`${styles.rec  } ${  styles.rec5}`} />
        <div className={styles.logoShadow} />
      </div>
    </Link>
  </header>
  )

export default Header
