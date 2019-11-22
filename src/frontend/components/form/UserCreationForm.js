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
import {Button, Grid, Typography} from '@material-ui/core';
import {validate} from '@natlibfi/identifier-services-commons';
import {useCookies} from 'react-cookie';

import renderTextField from './render/renderTextField';
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
	}
];

export default connect(null, actions)(reduxForm({
	form: 'userCreation',
	validate
})(
	props => {
		const {handleSubmit, valid, createUser, createUserRequest, pristine, handleClose, userInfo, setIsCreating, findPublisherIdByEmail} = props;
		const classes = useStyles();
		/* global COOKIE_NAME */
		const [cookie] = useCookies(COOKIE_NAME);
		const token = cookie[COOKIE_NAME];
		const [showForm, setShowForm] = useState(false);
		const [haveSSOId, setHaveSSOId] = useState(true);

		function handleCreateUser(values) {
			if (userInfo.role === 'admin') {
				createPublisherAdmin();
			} else {
				createPublisherUserRequest();
			}

			async function createPublisherAdmin() {
				let newUser;
				let publisher;
				if (values.userId) {
					publisher = await findPublisherIdByEmail({email: values.userId, token: token});
					console.log(publisher);
					newUser = {
						...values,
						publisher: publisher,
						role: 'publisher-admin',
						preferences: {
							defaultLanguage: 'fin'
						}
					};
				} else {
					publisher = await findPublisherIdByEmail({email: values.email, token: token});
					newUser = {
						...values,
						publisher: publisher,
						role: 'publisher-admin',
						givenName: values.givenName.toLowerCase(),
						familyName: values.familyName.toLowerCase(),
						preferences: {
							defaultLanguage: 'fin'
						}
					};
				}

				if (publisher !== 404) {
					const result = await createUser(newUser, token);
					if (result !== 409) {
						handleClose();
						setIsCreating(true);
					}
				}
			}

			async function createPublisherUserRequest() {
				let newUser;
				if (values.userId) {
					newUser = {...values};
				} else {
					newUser = {
						...values,
						givenName: values.givenName.toLowerCase(),
						familyName: values.familyName.toLowerCase()
					};
				}

				const result = await createUserRequest(newUser, token);
				if (result !== 404 && result !== 409) {
					handleClose();
					setIsCreating(true);
				}
			}
		}

		function handleClickYes() {
			setHaveSSOId(true);
			setShowForm(true);
		}

		function handleClickNo() {
			setHaveSSOId(false);
			setShowForm(true);
		}

		const component = (
			<>
				<form className={classes.container} onSubmit={handleSubmit(handleCreateUser)}>
					{showForm ? (
						<div className={classes.subContainer}>
							<Grid container spacing={3} direction="row">
								{haveSSOId ?
									(
										<Grid item xs={6}>
											<Field
												className={`${classes.textField} half`}
												component={renderTextField}
												label="SSO-Id"
												name="userId"
												type="text"
											/>
										</Grid>
									) : (
										fieldArray.map(list => {
											return element(list, classes);
										})
									)}
							</Grid>
							<div className={classes.btnContainer}>
								<Button type="submit" disabled={pristine || !valid} variant="contained" color="primary">
									Submit
								</Button>
							</div>
						</div>
					) : (
						<>
							<Typography>Do you have SSO-ID</Typography>
							<Button onClick={handleClickYes}>YES</Button>
							<Button onClick={handleClickNo}>NO</Button>
						</>
					)}
				</form>
			</>
		);

		return {
			...component,
			defaultProps: {
				formSyncErrors: null
			}
		};
	}));

function element(list, classes) {
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
