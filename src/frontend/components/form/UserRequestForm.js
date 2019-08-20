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
import {Field, FieldArray, reduxForm} from 'redux-form';
import {Button, Grid} from '@material-ui/core';
import PropTypes from 'prop-types';
import {validate} from '@natlibfi/identifier-services-commons';
import {useCookies} from 'react-cookie';

import renderTextField from './render/renderTextField';
import useStyles from '../../styles/form';
import * as actions from '../../store/actions/userActions';
import renderObjectArray from './render/renderObjectArray';

const selectOption = [
	{label: '', value: ''},
	{label: 'Work', value: 'work'},
	{label: 'Home', value: 'home'},
	{label: 'Other', value: 'other'}
];

const fieldArray = [
	{
		name: 'emails',
		type: 'arrayObject',
		label: 'Emails',
		width: 'full',
		subName: [
			{name: 'value', label: 'Email', className: 'children'},
			{name: 'type', label: 'Type', type: 'select', option: selectOption, className: 'children'}
		]
	},
	{
		name: 'givenName',
		type: 'text',
		label: 'Given Name',
		width: 'half'
	},
	{
		name: 'familyName',
		type: 'text',
		label: 'Family Name',
		width: 'half'
	}
];

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userCreation',
	validate
})(
	props => {
		const {handleSubmit, clearFields, valid, createUserRequest, pristine, apiURL} = props;
		const classes = useStyles();
		const [cookie] = useCookies('login-cookie');
		const token = cookie['login-cookie'];

		function getStepContent() {
			return element(fieldArray, classes, clearFields);
		}

		function handleCreateUser(values) {
			const newUser = {
				...values,
				givenName: values.givenName.toLowerCase(),
				familyName: values.familyName.toLowerCase()
			};
			// eslint-disable-next-line no-unused-expressions
			apiURL !== null && createUserRequest({API_URL: apiURL}, newUser, token);
		}

		const component = (
			<form className={classes.container} onSubmit={handleSubmit(handleCreateUser)}>
				<div className={classes.subContainer}>
					<Grid container spacing={3} direction="row">
						{(getStepContent())}
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
			...component,
			defaultProps: {
				formSyncErrors: null
			},
			propTypes: {
				handleSubmit: PropTypes.func.isRequired,
				pristine: PropTypes.bool.isRequired,
				formSyncErrors: PropTypes.shape({}),
				registerPublisher: PropTypes.func.isRequired,
				valid: PropTypes.bool.isRequired
			}
		};
	}));

function element(array, classes, clearFields) {
	return array.map(list =>

		((list.type === 'arrayObject') ?
			<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
				<FieldArray
					className={`${classes.arrayString} ${list.width}`}
					component={renderObjectArray}
					name={list.name}
					type={list.type}
					label={list.label}
					props={{clearFields, list}}
				/>
			</Grid> :

			<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
				<Field
					className={`${classes.textField} ${list.width}`}
					component={renderTextField}
					label={list.label}
					name={list.name}
					type={list.type}
				/>
			</Grid>)
	);
}

function mapStateToProps(state) {
	return ({
		apiURL: state.common.apiURL
	});
}
