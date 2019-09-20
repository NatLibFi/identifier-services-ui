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
import {Field, FieldArray, reduxForm, getFormValues} from 'redux-form';
import {Button, Grid, Stepper, Step, StepLabel, Typography, List} from '@material-ui/core';
import PropTypes from 'prop-types';
import {validate} from '@natlibfi/identifier-services-commons';

import useStyles from '../../styles/form';
import Snackbar from '../SnackBar';
import renderTextField from './render/renderTextField';
import renderAliases from './render/renderAliases';
import renderContactDetail from './render/renderContactDetail';
import renderSelect from './render/renderSelect';
import renderCheckbox from './render/renderCheckbox';
import renderMultiSelect from './render/renderMultiSelect';
import ListComponent from '../ListComponent';
import Captcha from '../Captcha';
import * as actions from '../../store/actions';

const classificationCodes = [0, 13, 24, 29, 32, 37, 40, 45, 100, 120, 130, 200, 210, 211, 270, 300, 310, 315, 316, 320, 330, 340, 350, 370, 375, 380, 390, 400, 410, 420, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 621, 622, 630, 640, 650, 660, 670, 672, 680, 690, 700, 710, 720, 730, 740, 750, 760, 765, 770, 780, 790, 800, 810, 820, 830, 840, 850, 860, 870, 880, 890, 900, 910, 920, 930, 940, 950].map(item => ({label: item, value: item}));

export const fieldArray = [
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
				name: 'publicationDetails[frequency]',
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
				name: 'postalAddress[address]',
				type: 'text',
				label: 'Address*',
				width: 'half'
			},
			{
				name: 'postalAddress[addressDetails]',
				type: 'text',
				label: 'Address Details',
				width: 'half'
			},
			{
				name: 'postalAddress[city]',
				type: 'text',
				label: 'City*',
				width: 'half'
			},
			{
				name: 'postalAddress[zip]',
				type: 'text',
				label: 'Zip*',
				width: 'half'
			},
			{
				name: 'classification',
				type: 'multiSelect',
				label: 'Classification*',
				options: classificationCodes,
				width: 'half'
			},
			{
				name: 'postalAddress[public]',
				type: 'checkbox',
				label: 'Public',
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
		primaryContact: [
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
		organizationalDetails1: [
			{
				title: 'AffiliateOf',
				fields: [
					{
						name: 'affiliateOf[affiliateOfAddress]',
						type: 'text',
						label: 'Address*',
						width: 'half'
					},
					{
						name: 'affiliateOf[affiliateOfAddressDetails]',
						type: 'text',
						label: 'Address Details',
						width: 'half'
					},
					{
						name: 'affiliateOf[affiliateOfCity]',
						type: 'text',
						label: 'City*',
						width: 'half'
					},
					{
						name: 'affiliateOf[affiliateOfZip]',
						type: 'text',
						label: 'Zip*',
						width: 'half'
					},
					{
						name: 'affiliateOf[affiliateOfName]',
						type: 'text',
						label: 'Name*',
						width: 'half'
					}

				]
			},
			{
				title: 'Affiliates',
				fields: [
					{
						name: 'affiliatesAddress',
						type: 'text',
						label: 'Address*',
						width: 'half'
					},
					{
						name: 'affiliatesAddressDetails',
						type: 'text',
						label: 'Address Details',
						width: 'half'
					},
					{
						name: 'affiliatesCity',
						type: 'text',
						label: 'City*',
						width: 'half'
					},
					{
						name: 'affiliatesZip',
						type: 'text',
						label: 'Zip*',
						width: 'half'
					},
					{
						name: 'affiliatesName',
						type: 'text',
						label: 'Name*',
						width: 'half'
					}
				]
			}
		]
	},
	{
		organizationalDetails2: [
			{
				title: 'DistributorOf',
				fields: [
					{
						name: 'distributorOf[distributorOfAddress]',
						type: 'text',
						label: 'Address*',
						width: 'half'
					},
					{
						name: 'distributorOf[distributorOfAddressDetails]',
						type: 'text',
						label: 'Address Details',
						width: 'half'
					},
					{
						name: 'distributorOf[distributorOfCity]',
						type: 'text',
						label: 'City*',
						width: 'half'
					},
					{
						name: 'distributorOf[distributorOfZip]',
						type: 'text',
						label: 'Zip*',
						width: 'half'
					},
					{
						name: 'distributorOf[distributorOfName]',
						type: 'text',
						label: 'Name*',
						width: 'half'
					}
				]
			},
			{
				title: 'Distributor',
				fields: [
					{
						name: 'distributor[distributorAddress]',
						type: 'text',
						label: 'Address*',
						width: 'half'
					},
					{
						name: 'distributor[distributorAddressDetails]',
						type: 'text',
						label: 'Address Details',
						width: 'half'
					},
					{
						name: 'distributor[distributorCity]',
						type: 'text',
						label: 'City*',
						width: 'half'
					},
					{
						name: 'distributor[distributorZip]',
						type: 'text',
						label: 'Zip*',
						width: 'half'
					},
					{
						name: 'distributor[distributorName]',
						type: 'text',
						label: 'Name*',
						width: 'half'
					}
				]
			}

		]
	},
	{
		review: 'review'
	}
];

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publisherRegistrationForm',
	initialValues: {
		language: 'eng',
		postalAddress:
			{
				public: false
			}
	},
	validate
})(
	props => {
		const {
			handleSubmit,
			clearFields,
			pristine,
			valid,
			publisherCreationRequest,
			captcha,
			loadSvgCaptcha,
			postCaptchaInput,
			publicationRegistration,
			handleSetPublisher,
			setPublisherRegForm,
			publisherValues,
			isAuthenticated
		} = props;
		const classes = useStyles();
		const [activeStep, setActiveStep] = useState(0);
		const [captchaInput, setCaptchaInput] = useState('');
		const [alertMessage, setAlertMessage] = useState(null);

		useEffect(() => {
			loadSvgCaptcha();
			if (publicationRegistration) {
				setPublisherRegForm(false);
			}
		// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [loadSvgCaptcha]);

		const steps = getSteps();
		function getStepContent(step) {
			switch (step) {
				case 0:
					return element(fieldArray[0].basicInformation, classes, clearFields);
				case 1:
					return fieldArrayElement(fieldArray[1].primaryContact, 'primaryContact', clearFields);
				case 2:
					return withFormTitle(fieldArray[2].organizationalDetails1, classes, 'affiliates', clearFields);
				case 3:
					return withFormTitle(fieldArray[3].organizationalDetails2, classes);
				case 4:
					return renderPreview(publisherValues);
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
				// eslint-disable-next-line no-undef, no-alert
				alert('Captcha not provided');
			} else if (captchaInput.length > 0) {
				const result = await postCaptchaInput(captchaInput, captcha.id);
				makeNewPublisherObj(values, result);
			}
		};

		function handleFormatPublisher() {
			handleSetPublisher(formatPublisher(publisherValues));
		}

		function makeNewPublisherObj(values, result) {
			const newPublisher = formatPublisher(values);
			if (result === true) {
				publisherCreationRequest(newPublisher);
			} else {
				// eslint-disable-next-line no-undef, no-alert
				alert('Please type the correct word in the image below');
				loadSvgCaptcha();
			}
		}

		function formatPublisher(values) {
			const newClassification = values.classification.map(item => item.value.toString());
			const organizationDetails = {
				affiliateOf: {...formatAddress(values.affiliateOf)},
				affiliates: values.affiliates.map(item => formatAddress(item)),
				distributorOf: {...formatAddress(values.distributorOf)},
				distributor: {...formatAddress(values.distributor)}
			};
			const publicationDetails = values.publicationDetails;
			const {affiliateOf, affiliates, distributorOf, distributor, ...rest} = {...values};

			const newPublisher = {
				...rest,
				organizationDetails: organizationDetails,
				classification: newClassification,
				publicationDetails: {...publicationDetails, frequency: Number(Object.values(publicationDetails))}
			};
			return newPublisher;
		}

		function formatAddress(obj) {
			const result = Object.keys(obj).reduce((acc, key) => {
				return {...acc, [replaceKey(key)]: obj[key]};
			}, {});
			return result;
		}

		// eslint-disable-next-line complexity
		function replaceKey(key) {
			switch (key) {
				case 'affiliateOfAddress':
				case 'affiliatesAddress':
				case 'distributorAddress':
				case 'distributorOfAddress':
					return 'address';
				case 'affiliateOfAddressDetails':
				case 'affiliatesAddressDetails':
				case 'distributorAddressDetails':
				case 'distributorOfAddressDetails':
					return 'addressDetails';
				case 'affiliateOfCity':
				case 'affiliatesCity':
				case 'distributorCity':
				case 'distributorOfCity':
					return 'city';
				case 'affiliateOfName':
				case 'affiliatesName':
				case 'distributorName':
				case 'distributorOfName':
					return 'name';
				case 'affiliateOfZip':
				case 'affiliatesZip':
				case 'distributorZip':
				case 'distributorOfZip':
					return 'zip';
				default:
					return null;
			}
		}

		const component = (
			<form className={classes.container} onSubmit={handleSubmit(handlePublisherRegistration)}>
				<Stepper alternativeLabel className={publicationRegistration ? classes.smallStepper : null} activeStep={activeStep}>
					{steps.map(label => (
						<Step key={label}>
							<StepLabel className={publicationRegistration ? classes.smallFontStepLabel : classes.stepLabel}>
								{label}
							</StepLabel>
						</Step>
					))}
				</Stepper>
				<div className={classes.subContainer}>
					<Grid container spacing={2} direction="row">
						{(getStepContent(activeStep))}

						{(!publicationRegistration &&
							activeStep === steps.length - 1) &&
							<Grid item xs={12}>
								{isAuthenticated ? null :
								<>
									<Captcha
										captchaInput={captchaInput}
										handleCaptchaInput={handleCaptchaInput}/>
									{/* eslint-disable-next-line react/no-danger */}
									<span dangerouslySetInnerHTML={{__html: captcha.data}}/>
								</>
								}
							</Grid>
						}
					</Grid>
					<div className={classes.btnContainer}>
						<Button disabled={activeStep === 0} onClick={handleBack}>
							Back
						</Button>
						{activeStep === steps.length - 1 ?
							null :
							<Button type="button" disabled={(pristine || !valid) || activeStep === steps.length - 1} variant="contained" color="primary" onClick={handleNext}>
								Next
							</Button>
						}
						{
							activeStep === steps.length - 1 &&
								(publicationRegistration ?
									(
										<Button type="button" disabled={pristine || !valid} variant="contained" color="primary" onClick={handleFormatPublisher}>
											Next
										</Button>
									) : (
										<Button type="submit" disabled={pristine || !valid} variant="contained" color="primary">
											Submit
										</Button>
									)
								)
						}
					</div>
				</div>
				{alertMessage &&
					<Snackbar
						anchorOrigin={{vertical: 'top', horizontal: 'center'}}
						message={alertMessage}
						setMessage={setAlertMessage}
						variant="error"
						openSnackBar={Boolean(alertMessage)}
					/>
				}
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
			case 'multiSelect':
				return (
					<Grid key={list.name} item xs={6}>
						<Field
							className={`${classes.selectField} ${list.width}`}
							component={renderMultiSelect}
							label={list.label}
							name={list.name}
							type={list.type}
							options={list.options}
							props={{isMulti: true}}
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

function withFormTitle(arr, classes, fieldName, clearFields) {
	return (
		<>
			{arr.map(item => (
				<Grid key={item.title} container spacing={2} direction="row">
					<div className={classes.formHead}>
						<Typography variant="h6">
							{item.title}
						</Typography>
					</div>
					{item.title === 'Affiliates' ? fieldArrayElement(item.fields, fieldName, clearFields) : element(item.fields, classes, clearFields)}
				</Grid>

			))}
		</>
	);
}

function fieldArrayElement(data, fieldName, clearFields) {
	return (
		<FieldArray
			component={renderContactDetail}
			name={fieldName}
			props={{clearFields, data, fieldName}}
		/>
	);
}

function renderPreview(publisherValues) {
	return (
		<>
			<Grid item xs={12} md={6}>
				<List>
					{
						Object.keys(publisherValues).map(key => {
							return typeof publisherValues[key] === 'string' ?
								(
									<ListComponent label={key} value={publisherValues[key]}/>
								) :
								null;
						})
					}
				</List>
			</Grid>
			<Grid item xs={12} md={6}>
				<List>
					{
						Object.keys(publisherValues).map(key => {
							return typeof publisherValues[key] === 'object' ?
								<ListComponent label={key} value={key === 'classification' ? publisherValues[key].map(item => (item.value).toString()) : publisherValues[key]}/> :
								null;
						})
					}
				</List>
			</Grid>
		</>
	);
}

function mapStateToProps(state) {
	return ({
		captcha: state.common.captcha,
		isAuthenticated: state.login.isAuthenticated,
		publisherValues: getFormValues('publisherRegistrationForm')(state)
	});
}
