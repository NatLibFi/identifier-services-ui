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
import useStyles from '../../styles/form';
import * as actions from '../../store/actions/userActions';
import renderCheckbox from './render/renderCheckbox';

const issnFields = [
	{
		name: 'prefix',
		type: 'text',
		label: 'Prefix*',
		width: 'half'
	},
	{
		name: 'rangeStart',
		type: 'text',
		label: 'Range Start*',
		width: 'half'
	},
	{
		name: 'rangeEnd',
		type: 'text',
		label: 'Range End*',
		width: 'half'
	},
	{
		name: 'active',
		type: 'checkbox',
		label: 'Active',
		width: 'half'
	}
];

export default connect(null, actions)(reduxForm({
	form: 'issnCreation',
	initialValues: {
		active: true
	},
	validate
})(
	props => {
		const {handleSubmit, valid, createIssn, pristine, handleClose, setUpdateComponent} = props;
		const classes = useStyles();
		/* global COOKIE_NAME */
		const [cookie] = useCookies(COOKIE_NAME);

		async function handleCreateIssn(values) {
			const response = await createIssn(values, cookie[COOKIE_NAME]);
			if (response === 201) {
				setUpdateComponent(true);
				handleClose();
			}
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

				case 'checkbox':
					return (
						<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
							<Field
								component={renderCheckbox}
								label={list.label}
								name={list.name}
							/>
						</Grid>
					);

				default:
					return null;
			}
		}

		const component = (
			<>
				<form className={classes.container} onSubmit={handleSubmit(handleCreateIssn)}>
					<div className={classes.subContainer}>
						<Grid container spacing={3}>
							{element(issnFields)}
						</Grid>
						<div className={classes.btnContainer}>
							<Button type="submit" disabled={pristine || !valid} variant="contained" color="primary">
								Submit
							</Button>
						</div>
					</div>
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
