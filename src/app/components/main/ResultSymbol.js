import React from 'react';
import PropTypes from 'prop-types';

import styles from './ResultSymbol.scss';

import symbol0 from '../../images/symbols/0.png';
import symbol2 from '../../images/symbols/2.png';
import symbol4 from '../../images/symbols/4.png';
import symbol6 from '../../images/symbols/6.png';
import symbol8 from '../../images/symbols/8.png';
import symbol10 from '../../images/symbols/10.png';
import symbol12 from '../../images/symbols/12.png';
import symbol14 from '../../images/symbols/14.png';


const ResultSymbol = ({
	index,
	...restProps
}) => {
	let contentElem;
	
	if(parseInt(index) % 2 === 1) {
		contentElem = (
			<div />
		);
	} else {
		switch(index) {
			case 0:
			case '0':
				contentElem = (
					<img src={symbol0} />
				);
				break;
			case 2:
			case '2':
				contentElem = (
					<img src={symbol2} />
				);
				break;
			case 4:
			case '4':
				contentElem = (
					<img src={symbol4} />
				);
				break;
			case 6:
			case '6':
				contentElem = (
					<img src={symbol6} />
				);
				break;
			case 8:
			case '8':
				contentElem = (
					<img src={symbol8} />
				);
				break;
			case 10:
			case '10':
				contentElem = (
					<img src={symbol10} />
				);
				break;
			case 12:
			case '12':
				contentElem = (
					<img src={symbol12} />
				);
				break;
			case 14:
			case '14':
				contentElem = (
					<img src={symbol14} />
				);
				break;
		}
	}

	return (
		<div {...restProps}
			 className={styles.wrapper}>
			{ contentElem }
		</div>
	);
};


ResultSymbol.propTypes = {
	index: PropTypes.oneOf([
		0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
		'0','1','2','3','4','5','6','7','8','9',
		'10','11','12','13','14','15'
	]).isRequired
};

export default ResultSymbol;
