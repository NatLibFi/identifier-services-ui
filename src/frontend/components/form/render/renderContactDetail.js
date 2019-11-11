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
	const {fields, data, fieldName, clearFields, meta: {touched, error}, values} = props;
	const contactDetail = values && {
		email: values.email,
		givenName: values.givenName,
		familyName: values.familyName
	};
	const affiliate = values && {
		affiliatesAddress: values.affiliatesAddress,
		affiliatesAddressDetails: values.affiliatesAddressDetails,
		affiliatesCity: values.affiliatesCity,
		affiliatesZip: values.affiliatesZip,
		affiliatesName: values.affiliatesName
	};
	const handleContactClick = () => {
		setErrors();
		if (values) {
			if (contactDetail && (contactDetail.email !== undefined)) {
				if (values.primaryContact) {
					if (values.primaryContact.some(item => item.email === contactDetail.email)) {
						setErrors('already exist');
					} else if (contactDetail.email !== undefined) {
						fields.push(contactDetail);
						clearFields(undefined, false, false, 'givenName', 'familyName', 'email');
					}
				} else if (contactDetail.email !== undefined) {
					fields.push(contactDetail);
					clearFields(undefined, false, false, 'givenName', 'familyName', 'email');
				}
			}
		}
	};

	const handleAffiliatesClick = () => {
		setErrors();
		if (values) {
			if (affiliate && (affiliate.affiliatesAddress !== undefined ||
				affiliate.affiliatesCity !== undefined ||
				affiliate.affiliatesZip !== undefined ||
				affiliate.affiliatesName !== undefined)) {
				if (values.affiliates) {
					if (values.affiliates.some(item => item.affiliatesName === affiliate.affiliatesName)) {
						setErrors('already exist');
					} else if (affiliate.affiliatesAddress !== undefined &&
						affiliate.affiliatesCity !== undefined &&
						affiliate.affiliatesZip !== undefined &&
						affiliate.affiliatesName !== undefined) {
						fields.push(affiliate);
						clearFields(undefined, false, false, 'affiliatesAddress', 'affiliatesAddressDetails', 'affiliatesCity', 'affiliatesZip', 'affiliatesZip', 'affiliatesName');
					}
				} else if (affiliate.affiliatesAddress !== undefined &&
					affiliate.affiliatesCity !== undefined &&
					affiliate.affiliatesZip !== undefined &&
					affiliate.affiliatesName !== undefined) {
					fields.push(affiliate);
					clearFields(undefined, false, false, 'affiliatesAddress', 'affiliatesAddressDetails', 'affiliatesCity', 'affiliatesZip', 'affiliatesZip', 'affiliatesName');
				}
			}
		}
	};

	const classes = useStyles();

	const component = (
		<>
			{data.map(list => {
				switch (list.width) {
					case 'half':
						return (
							<Grid key={list.name} item xs={6}>
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
					case 'full':
						return (
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
						);
					default:
						return null;
				}
			}
			)}
			{touched && error && <span>{error}</span>}
			{(fieldName === 'primaryContact' &&
				<>
					<Fab
						aria-label="Add"
						color="primary"
						size="small"
						title="Add more Contact Detail"
						onClick={handleContactClick}
					>
						<AddIcon/>
					</Fab>
					{values && values.primaryContact && values.primaryContact.map((item, index) => {
						return (
							<Chip
								key={item.email}
								label={item.email}
								onDelete={() => fields.remove(index)}
							/>
						);
					})}

				</>) || (fieldName === 'affiliates' &&
					<div className={classes.affiliatesAddBtn}>
						<Fab
							aria-label="Add"
							size="small"
							color="primary"
							title="Add more Contact Detail"
							onClick={handleAffiliatesClick}
						>
							<AddIcon/>
						</Fab>
						{values && values.affiliates && values.affiliates.map((item, index) => {
							return (
								<Chip
									key={item.affiliatesName}
									label={`${item.affiliatesName}${item.affiliatesAddress}`}
									onDelete={() => fields.remove(index)}
								/>
							);
						})}
					</div>) || null}
		</>
	);

	return {
		...component,
		defaultProps: {
			meta: {}
		},
		propTypes: {
			fields: PropTypes.arrayOf(PropTypes.shape({})),
			primaryContact: PropTypes.arrayOf(PropTypes.shape({})),
			meta: PropTypes.shape({touched: PropTypes.bool, error: PropTypes.bool})
		}
	};
});

