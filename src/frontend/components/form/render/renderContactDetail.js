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
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import AddIcon from '@material-ui/icons/Add';

import renderTextField from './renderTextField';
import useStyles from '../../../styles/form';

export default connect(state => ({
	values: getFormValues('publisherRegistrationForm')(state)

}))(props => {
	const [errors, setErrors] = React.useState();
	const {fields, array: {contactDetails}, clearFields, meta: {touched, error}, values} = props;

	const contactDetail = values && {
		givenName: values.givenName,
		familyName: values.familyName,
		email: values.email
	};
	const handleContactClick = () => {
		setErrors();
		if (values) {
			if (contactDetail && (contactDetail.email !== undefined || contactDetail.givenName !== undefined)) {
				if (values.contactDetails) {
					if (values.contactDetails.some(item => item.email === contactDetail.email)) {
						setErrors('already exist');
					} else if (contactDetail.email !== undefined && contactDetail.familyName !== undefined && contactDetail.givenName !== undefined) {
						fields.push(contactDetail);
						clearFields(undefined, false, false, 'givenName', 'familyName', 'email');
					}
				} else if (contactDetail.email !== undefined && contactDetail.familyName !== undefined && contactDetail.givenName !== undefined) {
					fields.push(contactDetail);
					clearFields(undefined, false, false, 'givenName', 'familyName', 'email');
				}
			}
		}
	};

	const classes = useStyles();

	const component = (
		<>
			{contactDetails.map(list =>
				(
					<Grid key={list.name} item xs={12}>
						<Field
							className={`${classes.textField} ${list.width}`}
							component={renderTextField}
							label={list.label}
							name={list.name}
							type={list.type}
							props={{errors}}
						/>
					</Grid>
				))}
			{touched && error && <span>{error}</span>}
			{values && values.contactDetails && values.contactDetails.map((item, index) => (
				<Chip
					key={item.email}
					label={`${item.givenName}${item.familyName}`}
					onDelete={() => fields.remove(index)}
				/>
			))}
			<Fab
				aria-label="Add"
				color="primary"
				title="Add more Contact Detail"
				disabled={touched && Boolean(error)}
				onClick={handleContactClick}
			>
				<AddIcon/>
			</Fab>
		</>
	);

	return {
		...component,
		defaultProps: {
			meta: {}
		},
		propTypes: {
			fields: PropTypes.arrayOf(PropTypes.shape({})),
			contactDetails: PropTypes.arrayOf(PropTypes.shape({})),
			meta: PropTypes.shape({touched: PropTypes.bool, error: PropTypes.bool})
		}
	};
});

