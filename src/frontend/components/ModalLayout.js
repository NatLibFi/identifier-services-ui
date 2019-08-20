/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable no-negated-condition */
/* eslint-disable no-unused-expressions */
/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * UI microservice of Identifier Services
 *
 * Copyright (C) 2019 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of identifier-services-ui
 *
 * identifier-services-ui program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * identifier-services-ui is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 */
import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Modal, Typography, Button} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import {PropTypes} from 'prop-types';

import useStyles from '../styles/modalLayout';

export default connect(mapStateToProps)(withRouter(props => {
	const {label, name, children, icon, fab, variant, color, classed, isTableRow, form, title, setPwd} = props;
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	useEffect(() => {
		isTableRow && setOpen(isTableRow);
	}, [isTableRow]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		title === 'Forgot Password ?' && setPwd(false);
		isTableRow && props.history.goBack();
	};

	const component = (
		<>
			{fab ?
				<EmailIcon className={classes.personIcon} onClick={handleOpen}/> :
				<Button variant={variant} color={color} className={classed} size="medium" onClick={handleOpen}>
					{icon === true && <PersonIcon className={classes.personIcon} onClick={handleOpen}/>}
					{label}
				</Button>
			}
			<Modal
				disableRestoreFocus
				className={classes.container}
				aria-labelledby={`modal-${name}`}
				aria-describedby="modal-description"
				open={open}
				// eslint-disable-next-line no-alert
				onClose={(form || fab) ? (() => {
					if (window.confirm('Do you want to exit?')) {
						handleClose();
					}
				}) : handleClose}
			>
				<div className={classes.main}>
					<IconButton aria-label="Close" className={classes.closeButton} onClick={handleClose}>
						<CloseIcon/>
					</IconButton>
					<Typography variant="h5" id={`modal-${name}`}>
						{title}
					</Typography>
					{React.cloneElement(children, {handleClose: handleClose})}
				</div>
			</Modal>
		</>
	);

	return {
		...component,
		defaultProps: {
			children: null
		},
		propTypes: {
			label: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			children: PropTypes.node
		}
	};
}));

function mapStateToProps(state) {
	return {
		isLogin: state.login.isLogin,
		userInfo: state.login.userInfo
	};
}
