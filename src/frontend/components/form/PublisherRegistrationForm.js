/* eslint-disable no-alert */
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
import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray, reduxForm} from 'redux-form';
import {Button, Grid, Stepper, Step, StepLabel} from '@material-ui/core';
import PropTypes from 'prop-types';
import {validate} from '@natlibfi/identifier-services-commons';
import useStyles from '../../styles/form';

import renderTextField from './render/renderTextField';
import renderAliases from './render/renderAliases';
import renderContactDetail from './render/renderContactDetail';
import renderSelect from './render/renderSelect';
import renderCheckbox from './render/renderCheckbox';
import Captcha from '../Captcha';
import * as actions from '../../store/actions';

const fieldArray = [
	{
		basicInformation: [
			{
				name: 'name',
				type: 'text',
				label: 'Name*',
				width: 'half'
			},
			{
				name: 'publisherEmail',
				type: 'text',
				label: 'Publisher Email*',
				width: 'half'
			},
			{
				name: 'publicationEstimate',
				type: 'text',
				label: 'Publication Estimate*',
				width: 'half'
			},
			{
				name: 'website',
				type: 'text',
				label: 'Website',
				width: 'half'
			},
			{
				name: 'phone',
				type: 'text',
				label: 'Phone*',
				width: 'half'
			},
			{
				name: 'language',
				type: 'select',
				label: 'Select Language',
				width: 'half',
				defaultValue: 'eng',
				options: [
					{label: 'English (Default Language)', value: 'eng'},
					{label: 'Suomi', value: 'fin'},
					{label: 'Svenska', value: 'swe'}
				]
			},
			{
				name: 'code',
				type: 'text',
				label: 'Code',
				width: 'half'
			},
			{
				name: 'aliases',
				type: 'arrayString',
				label: 'Aliases',
				width: 'half',
				subName: 'alias'
			}
		]
	},
	{
		contactDetails: [
			{
				name: 'givenName',
				type: 'text',
				label: 'Given Name',
				width: 'full'
			},
			{
				name: 'familyName',
				type: 'text',
				label: 'Family Name',
				width: 'full'
			},
			{
				name: 'email',
				type: 'email',
				label: 'Email*',
				width: 'full'
			}

		]
	},
	{
		affiliateOf: [
			{
				name: 'affiliateOfAddress',
				type: 'text',
				label: 'Address*',
				width: 'full'
			},
			{
				name: 'affiliateOfAddressDetails',
				type: 'text',
				label: 'Address Details',
				width: 'full'
			},
			{
				name: 'affiliateOfCity',
				type: 'text',
				label: 'City*',
				width: 'full'
			},
			{
				name: 'affiliateOfZip',
				type: 'text',
				label: 'Zip*',
				width: 'full'
			},
			{
				name: 'affiliateOfName',
				type: 'text',
				label: 'Name*',
				width: 'full'
			}

		]
	},
	{
		affiliates: [
			{
				name: 'affiliatesAddress',
				type: 'text',
				label: 'Address*',
				width: 'full'
			},
			{
				name: 'affiliatesAddressDetails',
				type: 'text',
				label: 'Address Details',
				width: 'full'
			},
			{
				name: 'affiliatesCity',
				type: 'text',
				label: 'City*',
				width: 'full'
			},
			{
				name: 'affiliatesZip',
				type: 'text',
				label: 'Zip*',
				width: 'full'
			},
			{
				name: 'affiliatesName',
				type: 'text',
				label: 'Name*',
				width: 'full'
			}

		]
	},
	{
		distributorOf: [
			{
				name: 'distributorOfAddress',
				type: 'text',
				label: 'Address*',
				width: 'full'
			},
			{
				name: 'distributorOfAddressDetails',
				type: 'text',
				label: 'Address Details',
				width: 'full'
			},
			{
				name: 'distributorOfCity',
				type: 'text',
				label: 'City*',
				width: 'full'
			},
			{
				name: 'distributorOfZip',
				type: 'text',
				label: 'Zip*',
				width: 'full'
			},
			{
				name: 'distributorOfName',
				type: 'text',
				label: 'Name*',
				width: 'full'
			}
		]
	},
	{
		distributor: [
			{
				name: 'distributorAddress',
				type: 'text',
				label: 'Address*',
				width: 'full'
			},
			{
				name: 'distributorAddressDetails',
				type: 'text',
				label: 'Address Details',
				width: 'full'
			},
			{
				name: 'distributorCity',
				type: 'text',
				label: 'City*',
				width: 'full'
			},
			{
				name: 'distributorZip',
				type: 'text',
				label: 'Zip*',
				width: 'full'
			},
			{
				name: 'distributorName',
				type: 'text',
				label: 'Name*',
				width: 'full'
			}

		]
	},
	{
		address: [
			{
				name: 'address',
				type: 'text',
				label: 'Address*',
				width: 'full'
			},
			{
				name: 'addressDetails',
				type: 'text',
				label: 'Address Details',
				width: 'full'
			},
			{
				name: 'city',
				type: 'text',
				label: 'City*',
				width: 'full'
			},
			{
				name: 'zip*',
				type: 'text',
				label: 'Zip',
				width: 'full'
			},
			{
				name: 'public',
				type: 'checkbox',
				label: 'Public',
				width: 'full'
			}

		]
	}
];

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publisherRegistrationForm',
	initialValues: {
		language: 'eng',
		public: false
	},
	validate
})(
	props => {
		const {handleSubmit, clearFields, pristine, valid, registerPublisher, captcha, loadSvgCaptcha, postCaptchaInput} = props;
		const classes = useStyles();
		const [activeStep, setActiveStep] = useState(0);
		const [captchaInput, setCaptchaInput] = useState('');
		useEffect(() => {
			loadSvgCaptcha();
		}, [loadSvgCaptcha]);

		const steps = getSteps();
		function getStepContent(step) {
			switch (step) {
				case 0:
					return element(fieldArray[0].basicInformation, classes, clearFields);
				case 1:
					return fieldArrayElement(fieldArray[1].contactDetails, 'contactDetails', clearFields, valid);
				case 2:
					return element(fieldArray[2].affiliateOf, classes);
				case 3:
					return fieldArrayElement(fieldArray[3].affiliates, 'affiliates', clearFields);
				case 4:
					return element(fieldArray[4].distributorOf, classes);
				case 5:
					return element(fieldArray[5].distributor, classes);
				case 6:
					return element(fieldArray[6].address, classes);
				default:
					return 'Unknown step';
			}
		}

		const handleCaptchaInput = e => {
			setCaptchaInput(e.target.value);
		};

		function handleNext() {
			setActiveStep(activeStep + 1);
		}

		function handleBack() {
			setActiveStep(activeStep - 1);
		}

		const handlePublisherRegistration = async values => {
			if (captchaInput.length === 0) {
				// eslint-disable-next-line no-undef
				alert('Captcha not provided');
			} else if (captchaInput.length > 0) {
				const result = await postCaptchaInput(captchaInput, captcha.id);
				if (result === true) {
					const newPublisher = {
						...values
					};
					registerPublisher(newPublisher);
				} else {
					// eslint-disable-next-line no-undef
					alert('Please type the correct word in the image below');
					loadSvgCaptcha();
				}
			}
		};

		const component = (
			<form className={classes.container} onSubmit={handleSubmit(handlePublisherRegistration)}>
				<Stepper alternativeLabel activeStep={activeStep}>
					{steps.map(label => (
						<Step key={label}>
							<StepLabel className={classes.stepLabel}>
								{label}
							</StepLabel>
						</Step>
					))}
				</Stepper>
				<div className={classes.subContainer}>
					<Grid container spacing={3} direction="row">
						{(getStepContent(activeStep))}
					</Grid>
					{
						activeStep === steps.length - 1 &&
						<>
							<Captcha
								captchaInput={captchaInput}
								handleCaptchaInput={handleCaptchaInput}/>
								{/* eslint-disable-next-line react/no-danger */}
							<span dangerouslySetInnerHTML={{__html: captcha.data}}/>
						</>
					}

					<div className={classes.btnContainer}>
						<Button disabled={activeStep === 0} onClick={handleBack}>
							Back
						</Button>
						{/* eslint-disable-next-line no-negated-condition */}
						{activeStep !== steps.length - 1 ?
							<Button type="button" disabled={(pristine || !valid) || activeStep === steps.length - 1} variant="contained" color="primary" onClick={handleNext}>
								Next
							</Button> : null
						}
						{
							activeStep === steps.length - 1 &&
								<Button type="submit" disabled={pristine || !valid} variant="contained" color="primary">
									Submit
								</Button>
						}
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

function getSteps() {
	return fieldArray.map(item => Object.keys(item));
}

function element(array, classes, clearFields) {
	return array.map(list => {
		switch (list.type) {
			case 'arrayString':
				return (
					<Grid key={list.name} item xs={12}>
						<FieldArray
							className={`${classes.arrayString} ${list.width}`}
							component={renderAliases}
							name={list.name}
							type={list.type}
							label={list.label}
							props={{clearFields, name: list.name, subName: list.subName}}
						/>
					</Grid>
				);
			case 'select':
				return (
					<Grid key={list.name} item xs={6}>
						<Field
							className={`${classes.selectField} ${list.width}`}
							component={renderSelect}
							label={list.label}
							name={list.name}
							type={list.type}
							options={list.options}
						/>
					</Grid>
				);
			case 'checkbox':
				return (
					<Grid key={list.name} item xs={6}>
						<Field
							component={renderCheckbox}
							label={list.label}
							name={list.name}
							type={list.type}
						/>
					</Grid>
				);
			case 'text':
				if (list.width === 'full') {
					return (
						<Grid key={list.name} item xs={12}>
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

				return (
					<Grid key={list.name} item xs={6}>
						<Field
							className={`${classes.textField} ${list.width}`}
							component={renderTextField}
							label={list.label}
							name={list.name}
							type={list.type}
						/>
					</Grid>
				);

			default:
				return null;
		}
	}
	);
}

function fieldArrayElement(data, fieldName, clearFields, valid) {
	console.log('****', valid)
	return (
		<FieldArray
			component={renderContactDetail}
			className="full"
			name={fieldName}
			props={{clearFields, data, fieldName, valid}}
		/>
	);
}

function mapStateToProps(state) {
	return ({
		captcha: state.common.captcha
	});
}
