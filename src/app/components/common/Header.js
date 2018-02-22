import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import HeaderRightBlock from './HeaderRightBlock';

import styles from './Header.scss';


export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
			<header className={styles.appBar}>
				<button className="btn-unstyled">
					<i className="fa fa-bars" />
				</button>
				<span className={styles.logo}>
					Dice Roll
				</span>

				<HeaderRightBlock />
				
			</header>
        );
    }
}
