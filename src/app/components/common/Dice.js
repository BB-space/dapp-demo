import React from 'react';
import PropTypes from 'prop-types';

import styles from './Dice.scss';


const Dice = ({
	face,
	...restProps
}) => {
	switch(face) {
		case 1:
		case '1':
			return (
				<div {...restProps}
					 className="first-face">
					<span className="pip" />
				</div>
			);
		case 2:
		case '2':
			return (
				<div {...restProps}
					 className="second-face">
					<span className="pip" />
					<span className="pip" />
				</div>
			);
		case 3:
		case '3':
			return (
				<div {...restProps}
					 className="third-face">
					<span className="pip" />
					<span className="pip" />
					<span className="pip" />
				</div>
			);
		case 4:
		case '4':
			return (
				<div {...restProps}
					 className="fourth-face">
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
				</div>
			);
		case 5:
		case '5':
			return (
				<div {...restProps}
					 className="fifth-face">
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
				</div>
			);
		case 6:
		case '6':
			return (
				<div {...restProps}
					 className="sixth-face">
					<div className="column">
						<span className="pip" />
						<span className="pip" />
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
						<span className="pip" />
						<span className="pip" />
					</div>
				</div>
			);
	}
};

Dice.propTypes = {
	face: PropTypes.oneOf([
		1,2,3,4,5,6,
		'1','2','3','4','5','6'
	]).isRequired
};

export default Dice;
