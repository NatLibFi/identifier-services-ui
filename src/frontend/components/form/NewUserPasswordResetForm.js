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
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {Button, Grid} from '@material-ui/core';
import {validate} from '@natlibfi/identifier-services-commons';

import useStyles from '../../styles/form';
import renderTextField from './render/renderTextField';
import * as actions from '../../store/actions';

const fieldArray = [
	{
		name: 'email',
		type: 'email',
		label: 'Email',
		width: 'full'
	},
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
		email,
		passwordReset,
		pristine,
		valid
	} = props;
	const classes = useStyles();
	const [error, setError] = useState(null);

	function handleOnSubmit(values) {
		const {newPassword, confirmPassword} = values;
		if (confirmPassword === newPassword) {
			setError(null);
			passwordReset(values);
			props.history.push('/');
		} else {
			setError('Password does not match');
		}
	}

	const component = (
		<form className={classes.passwordResetContainer} onSubmit={handleSubmit(handleOnSubmit)}>
			<Grid container spacing={2}>
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
				{error && <span>{error}</span>}
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
		captcha: state.common.captcha
	});
}

