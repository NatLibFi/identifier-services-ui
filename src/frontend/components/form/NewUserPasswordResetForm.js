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
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {Button, Grid, IconButton} from '@material-ui/core';
import {validate} from '@natlibfi/identifier-services-commons';
import CloseIcon from '@material-ui/icons/Close';
import HttpStatus from 'http-status';

import useStyles from '../../styles/form';
import {commonStyles} from '../../styles/app';
import renderTextField from './render/renderTextField';
import * as actions from '../../store/actions';
import Captcha from '../Captcha';

const fieldArray = [
	{
		name: 'newPassword',
		type: 'password',
		label: 'New Password*',
		width: 'full'
	},
	{
		name: 'confirmPassword',
		type: 'password',
		label: 'Re-type Password*',
		width: 'full'
	}
];

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'passwordResetForm',
	validate
})(props => {
	const {
		handleSubmit,
		passwordReset,
		pristine,
		isAuthenticated,
		postCaptchaInput,
		loadSvgCaptcha,
		setMessage,
		decryptToken,
		decodeToken,
		captcha,
		match,
		valid
	} = props;
	const {params} = match;
	const classes = useStyles();
	const commonStyle = commonStyles();
	const [error, setError] = useState(null);
	const [captchaInput, setCaptchaInput] = useState('');

	useEffect(() => {
		if (!isAuthenticated) {
			loadSvgCaptcha();
		}
	}, [isAuthenticated, loadSvgCaptcha]);

	const handleCaptchaInput = e => {
		setCaptchaInput(e.target.value);
	};

	async function handleOnSubmit(values) {
		const decrypted = await decryptToken(params);
		const decode = await decodeToken({token: decrypted});
		const {newPassword, confirmPassword} = values;
		if (captchaInput.length === 0) {
			setMessage({color: 'error', msg: 'Captcha not provided!!!'});
		} else if (captchaInput.length > 0) {
			const result = await postCaptchaInput(captchaInput, captcha.id);
			if (result === true) {
				if (confirmPassword === newPassword) {
					setError(null);
					const response = await passwordReset({...values, id: decode.userId});
					if (response === HttpStatus.OK) {
						props.history.push('/');
					}
				} else {
					setError('Password does not match');
				}
			} else {
				setMessage({color: 'error', msg: 'Please type the correct word in the image below'});
				loadSvgCaptcha();
			}
		}
	}

	const hideError = () => {
		setError(null);
	};

	const component = (
		<form className={classes.passwordResetContainer} onSubmit={handleSubmit(handleOnSubmit)}>
			<Grid container spacing={2} className={classes.resetForm}>
				{error && <div className={commonStyle.loginError}>{error}<IconButton onClick={hideError}><CloseIcon/></IconButton></div>}
				{fieldArray.map(list => (
					<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
						<Field
							className={`${classes.textField} ${list.width}`}
							component={renderTextField}
							label={list.label}
							name={list.name}
							type={list.type}
						/>
					</Grid>
				))}
				<Grid item xs={12}>
					{isAuthenticated ? null : (
						<>
							<Captcha
								captchaInput={captchaInput}
								handleCaptchaInput={handleCaptchaInput}
								className={classes.resetFormCaptcha}/>
							{/* eslint-disable-next-line react/no-danger */}
							<span dangerouslySetInnerHTML={{__html: captcha.data}}/>
						</>
					)}
				</Grid>
				<Grid item xs={12} className={classes.btnContainer}>
					<Button type="submit" disabled={pristine || !valid} variant="contained" color="primary">
						Submit
					</Button>
				</Grid>
			</Grid>
		</form>
	);

	return {
		...component
	};
}));

function mapStateToProps(state) {
	return ({
		email: state.login.userInfo.email,
		isAuthenticated: state.login.isAuthenticated,
		captcha: state.common.captcha
	});
}

