import React from 'react'
import { Link } from "gatsby";
import config from '../../data/SiteConfig';
import Categories from './Categories'
import styles from './Header.module.scss'

const Header = () => (
  <header>
    <div className={styles.wrapper}>
      <Link to="/">
        <img
          className={styles.avatar}
          src={config.userAvatar}
          alt={config.userName}
        />
      </Link>
    </div>
    <nav>
      <ul className={styles.mainNav}>
        <Categories activeClassName={styles.activeNav} />
        <li>
          <Link to="/about" activeClassName={styles.activeNav}>About</Link>
        </li>
      </ul>
    </nav>
  </header>
  )

export default Header
