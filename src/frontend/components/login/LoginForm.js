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
import {Grid, Button, Link, Typography, IconButton} from '@material-ui/core';
import {validate} from '@natlibfi/identifier-services-commons';
import PersonIcon from '@material-ui/icons/Person';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import CloseIcon from '@material-ui/icons/Close';
import renderTextField from '../form/render/renderTextField';
import useStyles from '../../styles/login';
import useFormStyles from '../../styles/form';
import * as actions from '../../store/actions';
import {commonStyles} from '../../styles/app';

export default connect(null, actions)(reduxForm({
	form: 'login', validate})(props => {
	const {pristine, valid, normalLogin, handleSubmit, handleClose, history, setPwd} = props;
	const classes = useStyles();
	const commonStyle = commonStyles();
	const formClasses = useFormStyles();
	const [showPassword, setShowPassword] = useState(false);
	const [loginError, setLoginError] = useState(null);

	async function handleLogin(values) {
		/* global API_URL */
		/* eslint no-undef: "error" */
		const response = await normalLogin({...values, API_URL: API_URL});
		if (response === 'unauthorize') {
			setLoginError('Incorrect username or Password');
		} else if (response) {
			switch (response.role) {
				case 'publisher-admin':
					history.push(`/publishers/${response.publisher}`);
					handleClose();
					break;
				case 'publisher':
					history.push(`/publishers/${response.publisher}`);
					handleClose();
					break;
				default:
					history.push('/publishers');
					handleClose();
			}
		}
	}

	const hideError = () => {
		setLoginError(null);
	};

	const component = (
		<form onSubmit={handleSubmit(handleLogin)}>
			<section className={classes.loginForm}>
				{loginError && <div className={commonStyle.loginError}>{loginError}<IconButton onClick={hideError}><CloseIcon/></IconButton></div>}
				<Grid container className={classes.inputGap} spacing={4} alignItems="flex-end">
					<Grid item xs={1}>
						<PersonIcon className={classes.personIcon}/>
					</Grid>

					<Grid item xs={11}>
						<Field
							className={formClasses.textField}
							name="username"
							label={<FormattedMessage id="login.normal.username"/>}
							component={renderTextField}
						/>
					</Grid>
				</Grid>
				<Grid container className={classes.inputGap} spacing={4} alignItems="flex-end">
					<Grid item xs={1}>
						<IconButton className={classes.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? <Visibility className={classes.personIcon}/> : <VisibilityOff className={classes.personIcon}/>}
						</IconButton>
					</Grid>

					<Grid item xs={11}>
						<Field
							className={formClasses.textField}
							name="password"
							label={<FormattedMessage id="login.normal.password"/>}
							type={showPassword ? 'text' : 'password'}
							component={renderTextField}
						/>
					</Grid>
				</Grid>
				<Button
					color="primary"
					variant="contained"
					type="submit"
					size="large"
					disabled={pristine || !valid}
				>
					<FormattedMessage id="login.normal.button"/>
				</Button>
				<div className={classes.pwdresetLink}>
					<span onClick={() => setPwd(true)}><FormattedMessage id="login.normal.forgotPassword"/></span>
				</div>
			</section>
			<div className={classes.notes}>
				<Typography><FormattedMessage id="login.normal.info"/>
					<Link><FormattedMessage id="login.normal.infoLink"/></Link>
				</Typography>
			</div>
		</form>
	);
	return {
		...component
	};
}
));
