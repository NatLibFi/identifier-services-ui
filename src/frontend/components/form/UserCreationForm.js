/* eslint-disable no-undef */
/* eslint-disable no-alert */
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
import React from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray, reduxForm} from 'redux-form';
import {Button, Grid} from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import PropTypes from 'prop-types';
import {validate} from '@natlibfi/identifier-services-commons';
import {useCookies} from 'react-cookie';

import renderTextField from './render/renderTextField';
import useStyles from '../../styles/form';
import * as actions from '../../store/actions/userActions';
import renderCheckboxes from './render/renderCheckboxes';
import renderSelect from './render/renderSelect';
import renderObjectArray from './render/renderObjectArray';

const roleOption = [
	{label: 'system', value: 'system'},
	{label: 'admin', value: 'admin'},
	{label: 'publisher-admin', value: 'publisherAdmin'},
	{label: 'publisher', value: 'publisher'}
];

const selectOption = [
	{label: 'ENG', value: 'eng'},
	{label: 'FIN', value: 'fin'},
	{label: 'SWE', value: 'swe'}
];

const fieldArray = [
	{
		name: 'role',
		type: 'select',
		label: 'Role',
		option: roleOption,
		width: 'half'
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
		name: 'defaultLanguage',
		type: 'select',
		label: 'Choose Language',
		option: selectOption,
		width: 'half'
	}
];

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userCreation',
	validate
})(
	props => {
		const {handleSubmit, clearFields, valid, createUser, pristine, apiURL} = props;
		const classes = useStyles();
		const [cookie] = useCookies('login-cookie');
		const token = cookie['login-cookie'];
		const [status, setStatus] = React.useState('');
		const [rejectTextArea, setRejectTextArea] = React.useState(false);
		const [rejectedText, setRejectText] = React.useState('');

		function getStepContent() {
			return element(fieldArray, classes, clearFields);
		}

		function handleCreateUser(values) {
			const newUser = {
				...values,
				givenName: values.givenName.toLowerCase(),
				familyName: values.familyName.toLowerCase(),
				role: values.role[0],
				preferences: {defaultLanguage: values.defaultLanguage}
			};
			// eslint-disable-next-line no-undef
			window.confirm('Please confirm again to accept') === true ?
				(
					delete newUser.defaultLanguage &&
					(
						apiURL !== null &&
						createUser({APIURL: apiURL}, newUser, token)
					)
				) :
				null;
		}

		function handleChange(event, values) {
			values !== null && setStatus(values);
		}

		function handleOnClick() {
			setRejectTextArea(true);
		}

		function handleRejectTextChange(e) {
			setRejectText(e.target.value);
		}

		function handleReject() {
		}

		const component = (
			<form className={classes.container} onSubmit={handleSubmit(handleCreateUser)}>
				<div className={classes.subContainer}>
					<Grid container spacing={3} direction="row">
						{(getStepContent())}
					</Grid>
					<Grid>
						<Grid item>
							<ToggleButtonGroup exclusive value={status} onChange={handleChange}>
								<Button disabled={rejectTextArea || !valid || pristine} value="Accept" type="submit">
									Accept
								</Button>
								<ToggleButton value="Reject" onClick={handleOnClick}>
									Reject
								</ToggleButton>
							</ToggleButtonGroup>
						</Grid>
						<Grid item>
							{rejectTextArea ?
								<div>
									<TextareaAutosize
										aria-label="Minimum height"
										rows={5}
										placeholder="Minimum 3 rows"
										value={rejectedText}
										onChange={handleRejectTextChange}
									/>;
									<Button variant="outlined" color="primary" onClick={handleReject}>Submit</Button>
									<Button variant="outlined" color="primary" onClick={e => setRejectTextArea(false) || handleChange(e, '')}>Cancel</Button>
								</div> :
								null}
						</Grid>
					</Grid>

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
		// eslint-disable-next-line no-negated-condition
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
			((list.type === 'check') ?
				<Grid key={list.name} item xs={(list.width === 'full') ? 12 : 6}>
					<Field
						className={`${classes.textField} ${list.width}`}
						component={renderCheckboxes}
						label={list.label}
						name={list.name}
						type={list.type}
						options={list.option}
						props={{name: list.name}}
					/>
				</Grid> :
				((list.type === 'select') ?
					<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
						<Field
							className={`${classes.textField} ${list.width}`}
							component={renderSelect}
							label={list.label}
							name={list.name}
							type={list.type}
							options={list.option}
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
					</Grid>)))
	);
}

function mapStateToProps(state) {
	return ({
		apiURL: state.common.apiURL
	});
}

