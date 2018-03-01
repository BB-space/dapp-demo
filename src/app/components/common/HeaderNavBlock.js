import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import styles from './HeaderNavBlock.scss';


export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
			<nav className={styles.wrapper}>
				<ul className={classNames([
						'ul-unstyled',
						styles.navList
				])}>
                    <li className={styles.navItem}>
                        Fairness
                    </li>
                    <li className={styles.navItem}>
                        <Link to="faq">FAQ</Link>
                    </li>
					<li className={styles.navItem}>
                        Statistics
                    </li>
                </ul>
			</nav>
        );
    }
}
