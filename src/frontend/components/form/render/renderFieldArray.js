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
import {Grid, Fab, Chip} from '@material-ui/core';
import {Field, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import AddIcon from '@material-ui/icons/Add';

import renderTextField from './renderTextField';
import renderSelect from './renderSelect';
import useStyles from '../../../styles/form';
import * as actions from '../../../store/actions';

export default connect(mapStateToProps, actions)(props => {
	const [errors, setErrors] = React.useState();
	const {fields, data, fieldName, clearFields, meta: {touched, error}, values, formName, setFormName} = props;
	setFormName(formName);

	const fieldValues = values && getFieldValue(values);

	const handleOnClick = () => {
		setErrors();
		if (values) {
			const keys = Object.keys(fieldValues);
			if (fieldValues && (keys.some(key => fieldValues[key] !== undefined))) {
				if (values[fieldName]) {
					if (values[fieldName].some(item => keys.some(key => item[key] === fieldValues[key]))) {
						setErrors('already exist');
					} else if (keys.some(key => fieldValues[key] !== undefined)) {
						fields.push(fieldValues);
						keys.map(key => {
							return clearFields(undefined, false, false, key);
						});
					}
				} else if (keys.some(key => fieldValues[key] !== undefined)) {
					fields.push(fieldValues);
					keys.map(key => {
						return clearFields(undefined, false, false, key);
					});
				}
			}
		}
	};

	const classes = useStyles();

	const component = (
		<>
			{data.map(list => {
				switch (list.type) {
					case 'text':
						return (
							<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
								<Field
									className={`${classes.textField} ${list.width}`}
									component={renderTextField}
									label={list.label}
									name={list.name}
									type={list.type}
									props={{errors}}
								/>
							</Grid>
						);
					case 'select':
						return (
							<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
								<Field
									className={`${classes.textField} ${list.width}`}
									component={renderSelect}
									label={list.label}
									name={list.name}
									type={list.type}
									options={list.options}
									props={{errors}}
								/>
							</Grid>
						);
					default:
						return null;
				}
			}
			)}
			{touched && error && <span>{error}</span>}
			<Grid xs={12} className={classes.addFabBtn}>
				{
					<>
						<Fab
							aria-label="Add"
							color="primary"
							size="small"
							title="Add more"
							variant="extended"
							onClick={handleOnClick}
						>
							<AddIcon/>
							{`Add ${fieldName}`}
						</Fab>
						{values && values[fieldName] && values[fieldName].map((item, index) => {
							const y = Object.keys(fieldValues);
							return (
								<Chip
									key={`${item[y[0]]} ${item[y[1]]}`}
									label={`${item[y[0]]} ${item[y[1]]}`}
									onDelete={() => fields.remove(index)}
								/>
							);
						})}

					</>
				}
			</Grid>
		</>
	);

	return {
		...component
	};

	function getFieldValue(values) {
		switch (fieldName) {
			case ('primaryContact'):
				return (
					{
						email: values.email,
						givenName: values.givenName,
						familyName: values.familyName
					}
				);
			case ('affiliates'):
				return (
					{
						affiliatesAddress: values.affiliatesAddress,
						affiliatesAddressDetails: values.affiliatesAddressDetails,
						affiliatesCity: values.affiliatesCity,
						affiliatesZip: values.affiliatesZip,
						affiliatesName: values.affiliatesName
					}
				);
			case ('authors'):
				return (
					{
						role: values.role,
						authorGivenName: values.authorGivenName,
						authorFamilyName: values.authorFamilyName
					}
				);
			default:
				return null;
		}
	}
});

function mapStateToProps(state) {
	return (
		{
			values: getFormValues(state.common.formName)(state)
		});
}

