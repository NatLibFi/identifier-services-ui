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
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import PropTypes from 'prop-types';
import {validate} from '@natlibfi/identifier-services-commons';

import renderTextField from './render/renderTextField';
import useStyles from '../../styles/form';
import * as actions from '../../store/actions/userActions';
import renderSelect from './render/renderSelect';

const roleOption = [
	{label: 'system', value: 'system'},
	{label: 'admin', value: 'admin'},
	{label: 'publisher admin', value: 'publisher-admin'},
	{label: 'publisher', value: 'publisher'}
];

const selectOption = [
	{label: 'ENG', value: 'eng'},
	{label: 'FIN', value: 'fin'},
	{label: 'SWE', value: 'swe'}
];

const fieldArray = [
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
		name: 'email',
		type: 'email',
		label: 'Email',
		width: 'half'
	},
	{
		name: 'publisher',
		type: 'text',
		label: 'Publisher',
		width: 'half'
	},
	{
		name: 'backgroundProcessingState',
		type: 'text',
		label: 'Background Processing State',
		width: 'half'
	},
	{
		name: 'createdResource',
		type: 'text',
		label: 'Created Resource',
		width: 'half'
	},
	{
		name: 'role',
		type: 'select',
		label: 'Role',
		options: roleOption,
		width: 'half'
	},
	{
		name: 'preferences[defaultLanguage]',
		type: 'select',
		label: 'Choose Language',
		options: selectOption,
		width: 'half',
		defaultValue: 'fin'
	}
];

export default connect(null, actions)(reduxForm({
	form: 'userCreation',
	validate
})(
	props => {
		const {handleSubmit, clearFields, valid, setNewValues, pristine} = props;
		const classes = useStyles();
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
				rejectionReason: rejectedText,
				role: values.role
			};
			// eslint-disable-next-line no-unused-expressions, no-undef, no-alert
			confirm('Please confirm again to accept') === true ?
				(
					delete newUser.defaultLanguage && setNewValues(newUser)
				) :
				setStatus('');
		}

		function handleChange(event, values) {
			return values !== null && setStatus(values);
		}

		function handleOnClick() {
			setRejectTextArea(true);
		}

		function handleRejectTextChange(e) {
			setRejectText(e.target.value);
		}

		function handleReject() {
			setRejectText(rejectedText);
			setRejectTextArea(false);
		}

		const component = (
			<form className={classes.container} onSubmit={handleSubmit(handleCreateUser)}>
				<div className={classes.subContainer}>
					<Grid container spacing={3} direction="row">
						{(getStepContent())}
					</Grid>
					<Grid>
						<Grid item>
							<ToggleButtonGroup exclusive className={classes.toggleBtnGrp} value={status} onChange={handleChange}>
								<ToggleButton disabled={rejectTextArea || !valid || pristine} value="Accept" type="submit">
									Accept
								</ToggleButton>
								<ToggleButton disabled={Boolean(status === 'Accept')} value="Reject" onClick={handleOnClick}>
									Reject
								</ToggleButton>
							</ToggleButtonGroup>
						</Grid>
						<Grid item>
							{rejectTextArea ?
								<div>
									<TextareaAutosize
										style={{width: '100%'}}
										aria-label="Minimum height"
										rows={5}
										placeholder="Rejection reason here..."
										value={rejectedText}
										onChange={handleRejectTextChange}
									/>
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
				valid: PropTypes.bool.isRequired
			}
		};
	}));

function element(array, classes) {
	return array.map(list =>
		(list.type === 'select') ?
			<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
				<Field
					className={`${classes.selectField} ${list.width}`}
					component={renderSelect}
					label={list.label}
					name={list.name}
					type={list.type}
					options={list.options}
					props={{defaultValue: list.defaultValue}}
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
			</Grid>
	);
}
