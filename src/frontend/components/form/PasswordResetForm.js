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

import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {Button, Grid} from '@material-ui/core';
import {validate} from '@natlibfi/identifier-services-commons';

import useStyles from '../../styles/form';
import renderTextField from './render/renderTextField';
import * as actions from '../../store/actions/userActions';

const fieldArray = [
	{
		name: 'newPassword',
		type: 'password',
		label: 'New Password*',
		width: 'half'
	},
	{
		name: 'confirmPassword',
		type: 'password',
		label: 'Re-type Password*',
		width: 'half'
	}
];

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'passwordResetForm',
	validate
})(props => {
	const {
		handleSubmit,
		pristine,
		valid
	} = props;
	const classes = useStyles();
	const component = (
		<form className={classes.container} onSubmit={console.log('submit')}>
			<div className={classes.subContainer}>
				<Grid container spacing={2} direction="row">
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
				</Grid>
				<div className={classes.btnContainer}>
					<Button type="submit" disabled={pristine || !valid} variant="contained" color="primary">
                        Submit
					</Button>
				</div>
			</div>
		</form>
	);

	return {
		...component
	};
}));

function mapStateToProps(state) {
	return ({
		captcha: state.common.captcha
	});
}

