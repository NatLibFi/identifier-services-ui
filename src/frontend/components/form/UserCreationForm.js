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
import {Button, Grid, Radio} from '@material-ui/core';
import {validate} from '@natlibfi/identifier-services-commons';
import {useCookies} from 'react-cookie';

import renderTextField from './render/renderTextField';
import useStyles from '../../styles/form';
import * as actions from '../../store/actions/userActions';
import renderSimpleRadio from './render/renderSimpleRadio';

const withoutSso = [
	{
		name: 'email',
		type: 'text',
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
		width: 'half'
	}
];

const withSsoFields = [
	{
		name: 'userId',
		type: 'text',
		label: 'SSO-ID',
		width: 'full'
	},
	{
		name: 'role',
		type: 'radio',
		label: 'Select Role',
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
				createUserByAdmin();
			} else {
				createPublisherUserRequest();
			}

			async function createUserByAdmin() {
				let newUser = {
					...values,
					role: values.role,
					preferences: {
						defaultLanguage: 'fin'
					}
				};
				let publisher;
				if (values.role !== 'admin') {
					if (values.userId) {
						publisher = await findPublisherIdByEmail({email: values.userId, token: token});
						newUser = {
							...newUser,
							publisher: publisher
						};
					} else {
						publisher = await findPublisherIdByEmail({email: values.email, token: token});
						newUser = {
							...newUser,
							publisher: publisher,
							givenName: values.givenName.toLowerCase(),
							familyName: values.familyName.toLowerCase()
						};
					}
				}

				if (publisher !== 404) {
					const result = await createUser(newUser, token);
					if (result !== 404 && result !== 409) {
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

		function element(array) {
			return array.map(list => {
				return render(list);
			});
		}

		function render(list) {
			switch (list.type) {
				case 'text':
					return (
						<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
							<Field
								className={`${classes.textField} ${list.width}`}
								component={renderTextField}
								label={list.label}
								name={list.name}
							/>
						</Grid>
					);

				case 'radio':
					if (userInfo.role !== 'publisher-admin') {
						return (
							<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
								<Field name={list.name} component={renderSimpleRadio} label={list.label}>
									<Radio value="admin" label="Admin"/>
									<Radio value="publisher-admin" label="Publisher-Admin"/>
								</Field>
							</Grid>
						);
					}

					break;

				default:
					return null;
			}
		}

		const component = (
			<>
				<form className={classes.container} onSubmit={handleSubmit(handleCreateUser)}>
					{showForm ? (
						<div className={classes.subContainer}>
							<Grid container spacing={3} direction="row">
								{haveSSOId ? element(withSsoFields) : element(withoutSso)}
							</Grid>
							<div className={classes.btnContainer}>
								<Button type="submit" disabled={pristine || !valid} variant="contained" color="primary">
									Submit
								</Button>
							</div>
						</div>
					) : (
						<div className={classes.usercreationSelect}>
							<Button variant="outlined" color="primary" onClick={handleClickYes}>With SSO-ID</Button> &nbsp;
							<Button variant="outlined" color="primary" onClick={handleClickNo}>Without SSO-ID</Button>
						</div>
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
