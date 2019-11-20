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
import {useCookies} from 'react-cookie';

import renderTextField from './render/renderTextField';
import renderRadioButton from './render/renderRadioButton';
import useStyles from '../../styles/form';
import * as actions from '../../store/actions/userActions';

const fieldArray = [
	{
		name: 'email',
		type: 'email',
		label: 'Email',
		width: 'full'
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
	},
	{
		name: 'role',
		type: 'radio',
		label: 'Select Role',
		width: 'half',
		options: [
			{label: 'Publisher', value: 'publisher'},
			{label: 'Publisher Admin', value: 'publisher-admin'}
		]
	},
	{
		name: 'SSOId',
		type: 'text',
		label: 'SSO-Id',
		width: 'half'
	}
];

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userCreation',
	validate
})(
	props => {
		const {handleSubmit, valid, createUser, pristine, handleClose, setIsCreating, searchPublisher, publisher} = props;
		const classes = useStyles();
		/* global COOKIE_NAME */
		const [cookie] = useCookies(COOKIE_NAME);
		const token = cookie[COOKIE_NAME];

		async function handleCreateUser(values) {
			searchPublisher({searchText: values.email, token: token});
			const publisherId = publisher && publisher.id;
			const newUser = {
				...values,
				publisher: publisherId,
				givenName: values.givenName.toLowerCase(),
				familyName: values.familyName.toLowerCase(),
				preferences: {
					defaultLanguage: 'fin'
				},
				userId: values.userId ? values.userId : values.email
			};

			await createUser(newUser, token);

			handleClose();
			setIsCreating(true);
		}

		const component = (
			<form className={classes.container} onSubmit={handleSubmit(handleCreateUser)}>
				<div className={classes.subContainer}>
					<Grid container spacing={3} direction="row">
						{fieldArray.map(list => {
							return element(list, classes);
						})}
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
			}
		};
	}));

function mapStateToProps(state) {
	return {
		publisher: state.publisher.searchedPublisher[0]
	};
}

function element(list, classes) {
	switch (list.type) {
		case 'radio':
			return (
				<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
					<Field
						className={`${classes.textField} ${list.width}`}
						component={renderRadioButton}
						label={list.label}
						name={list.name}
						type={list.type}
						options={list.options}
					/>
				</Grid>
			);
		default:
			return (
				<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
					<Field
						className={`${classes.textField} ${list.width}`}
						component={renderTextField}
						label={list.label}
						name={list.name}
						type={list.type}
					/>
				</Grid>
			);
	}
}
