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
import React, {useState} from 'react';
import {TextField, Button} from '@material-ui/core';
import useStyles from '../../styles/login';
import * as actions from '../../store/actions';
import HttpStatus from 'http-status';
import {connect} from 'react-redux';
export default connect(null, actions)(props => {
	const {passwordResetForm, setPwd, handleClose} = props;
	const [email, setEmail] = useState('');
	const classes = useStyles();
	const handleEmailChange = e => {
		setEmail(e.target.value);
	};

	const handleEmailSubmit = async e => {
		e.preventDefault();
		const result = await passwordResetForm({id: email});
		if (result === HttpStatus.OK) {
			setPwd(false);
			handleClose();
		}
	};

	const component = (
		<>
			<div>
				Enter your email address and we will send you a link to reset your password.
			</div>
			<form onSubmit={handleEmailSubmit}>
				<TextField
					variant="outlined"
					placeholder="Enter Your email address"
					className={classes.resetInput}
					value={email}
					onChange={handleEmailChange}/>
				<Button
					variant="contained"
					color="primary"
					className={classes.resetBtn}
					onClick={handleEmailSubmit}
				>
					Send password reset email
				</Button>
			</form>
		</>
	);
	return {
		...component
	};
});
