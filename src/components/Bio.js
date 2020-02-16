import React from 'react'
import { Follow } from 'react-twitter-widgets'
import styles from './Bio.module.scss'

const Bio = ({ config, expanded }) => (
  <div className={styles.wrapper}>
    <img
      className={styles.avatar}
      src={config.userAvatar}
      alt={config.userName}
    />
    <p>
      Written by <strong>{config.userName}</strong> who is the senior of senior developers, the most important person of master developers to the max.
      {` `}

      <Follow
        username={config.userTwitter}
        options={{ count: expanded ? true : "none" }}
      />
    </p>
  </div>
)

export default Bio;
