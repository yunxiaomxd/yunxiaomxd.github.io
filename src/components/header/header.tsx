import classNames from 'classnames';
import { HEADER_TABS } from './constant';

import styles from './style.module.scss';

export default function Header() {
  return (
    <div className={styles.header}>
      {
        HEADER_TABS.map((v) => (
          <div key={v.value} className={styles.headerItem}>
            {v.label}
          </div>
        ))
      }
    </div>
  )
}