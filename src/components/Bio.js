import React from 'react'
import { Follow } from 'react-twitter-widgets'
import styles from './Bio.module.scss'

const Bio = ({ config, expanded }) => (
  <div className={styles.wrapper}>
    <p>
      Written by <strong>{config.userName}</strong> who lives and works in Leipzig building beautiful things.
      {` `}

      <Follow
        username={config.userTwitter}
        options={{ count: expanded ? true : "none" }}
      />
    </p>
  </div>
)

export default Bio;
