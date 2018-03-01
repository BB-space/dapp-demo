import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import HeaderNavBlock from './HeaderNavBlock';
import HeaderRightBlock from './HeaderRightBlock';

import styles from './Header.scss';


export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
			<header className={styles.appBar}>
				<div className={styles.logoBlock}>
					<span className={styles.logo}>
						<Link to="/">Dice Roll</Link>
					</span>
				</div>
				<HeaderNavBlock />
				
				<HeaderRightBlock />
			</header>
        );
    }
}
