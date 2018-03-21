import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './Modal.scss';


const Modal = ({
    isOpen=false,
    className='',
	style,
    onClickOutside,
    children
}) => {
	return (
        <div
			className={classNames([styles.wrapper, {
                [styles.open]: isOpen
			}])}
		>
            <div className={classNames(styles.content, {
                    [className]: !!className
            })}
                 style={style}>
                { children }
            </div>
            <div className={styles.mask}
                 onClick={onClickOutside} />
        </div>
	);
};

Modal.propTypes = {
    isOpen: PropTypes.bool,
    className: PropTypes.string,
    onClickOutside: PropTypes.func
};

export default Modal;
