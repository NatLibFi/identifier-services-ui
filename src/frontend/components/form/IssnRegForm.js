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
import {reduxForm, getFormValues} from 'redux-form';
import {validate} from '@natlibfi/identifier-services-commons';
import {Button, Grid, Stepper, Step, StepLabel, Typography, List} from '@material-ui/core';
import {connect} from 'react-redux';
import HttpStatus from 'http-status';
import {useCookies} from 'react-cookie';

import ResetCaptchaButton from './ResetCaptchaButton';
import * as actions from '../../store/actions';
import useStyles from '../../styles/form';
import Captcha from '../Captcha';
import ListComponent from '../ListComponent';
import {element as publisherElement, fieldArrayElement} from './publisherRegistrationForm/commons';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'issnRegForm',
	initialValues: {
		language: 'eng',
		publisherLanguage: 'eng',
		postalAddress:
			{
				public: false
			}
	},
	destroyOnUnmount: false,
	validate
})(
	props => {
		const {
			loadSvgCaptcha,
			captcha,
			pristine,
			valid,
			postCaptchaInput,
			publicationValues,
			clearFields,
			user,
			setMessage,
			isAuthenticated,
			publicationCreation,
			publicationCreationRequest,
			handleClose,
			setIsCreating,
			handleSubmit,
			reset
		} = props;
		const fieldArray = getFieldArray(user);
		const classes = useStyles();
		const [activeStep, setActiveStep] = useState(0);
		const [captchaInput, setCaptchaInput] = useState('');
		/* global COOKIE_NAME */
		const [cookie] = useCookies(COOKIE_NAME);
		const steps = getSteps(fieldArray);
		useEffect(() => {
			if (!isAuthenticated) {
				loadSvgCaptcha();
			}
		}, [isAuthenticated, loadSvgCaptcha]);
		useEffect(() => {
			if (isAuthenticated) {
				setActiveStep(2);
			}
		}, [isAuthenticated]);
		function getStepContent(step) {
			switch (step) {
				case 0:
					return publisherElement({array: fieldArray[0].publisherBasicInfo, classes, clearFields});
				case 1:
					return fieldArrayElement({data: fieldArray[1].primaryContact, fieldName: 'primaryContact', clearFields});
				case 2:
					return publisherElement({array: fieldArray[2].basicInformation, classes, clearFields});
				case 3:
					return withFormTitle({arr: fieldArray[3].Time, publicationValues, clearFields});
				case 4:
					return withFormTitle({arr: fieldArray[4].PreviousPublication, publicationValues, clearFields});
				case 5:
					return withFormTitle({arr: fieldArray[5].SeriesDetails, publicationValues, clearFields});
				case 6:
					return renderPreview(publicationValues);
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

		async function handlePublicationRegistration(values) {
			if (isAuthenticated) {
				const result = await publicationCreation({values: formatPublicationValues(values), token: cookie[COOKIE_NAME], subType: 'issn'});
				if (result === HttpStatus.CREATED) {
					handleClose();
					setIsCreating(true);
					reset();
				}
			} else if (captchaInput.length === 0) {
				setMessage({color: 'error', msg: 'Captcha not provided'});
			} else if (captchaInput.length > 0) {
				const result = await postCaptchaInput(captchaInput, captcha.id);
				submitPublication(formatPublicationValues(values), result);
			}
		}

		function formatPublicationValues(values) {
			const publisher = isAuthenticated ? user.publisher : {
				name: values.name,
				postalAddress: values.postalAddress,
				publisherEmail: values.publisherEmail,
				phone: values.phone,
				language: values.publisherLanguage,
				primaryContact: values.primaryContact,
				aliases: values.aliases && values.aliases
			};
			const {name, postalAddress, publisherEmail, phone, publisherLanguage, primaryContact, ...formattedPublicationValues} = {
				...values,
				publisher,
				firstNumber: values.firstNumber,
				firstYear: Number(values.firstYear),
				frequency: values.frequency.value,
				previousPublication: values.previousPublication && {
					...values.previousPublication,
					lastYear: values.previousPublication.lastYear && Number(values.previousPublication.lastYear),
					lastNumber: values.previousPublication.lastNumber && values.previousPublication.lastNumber
				},
				type: values.type.value
			};
			return formattedPublicationValues;
		}

		async function submitPublication(values, result) {
			if (result === true) {
				const result = await publicationCreationRequest({values: values, subType: 'issn'});
				if (result === HttpStatus.CREATED) {
					handleClose();
					reset();
				}
			} else {
				setMessage({color: 'error', msg: 'Please type the correct word in the image below'});
				loadSvgCaptcha();
			}
		}

		function renderPreview(publicationValues) {
			const values = formatPublicationValues(publicationValues);
			const {seriesDetails, ...formatValues} = {
				...values,
				mainSeries: values.seriesDetails && values.seriesDetails.mainSeries,
				subSeries: values.seriesDetails && values.seriesDetails.subSeries
			};
			return (
				<>
					<Grid item xs={12} md={6}>
						<List>
							{
								Object.keys(formatValues).map(key => {
									return (typeof formatValues[key] === 'string') ?
										(
											<ListComponent label={key} value={formatValues[key]}/>
										) :
										null;
								})
							}
						</List>
					</Grid>
					<Grid item xs={12} md={6}>
						<List>
							{
								Object.keys(formatValues).map(key => {
									return (typeof formatValues[key] === 'object') ?
										(
											<ListComponent label={key} value={formatValues[key]}/>
										) :
										null;
								})
							}
						</List>
					</Grid>
				</>
			);
		}

		const component = (
			<form className={classes.container} onSubmit={handleSubmit(handlePublicationRegistration)}>
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
					<Grid container spacing={2} direction="row">
						{(getStepContent(activeStep))}

						{
							activeStep === steps.length - 1 &&
								<Grid item xs={12} className={classes.captchaContainer}>
									{isAuthenticated ? null : (
										<>
											<Captcha
												captchaInput={captchaInput}
												handleCaptchaInput={handleCaptchaInput}
												className={classes.captcha}/>
											{/* eslint-disable-next-line react/no-danger */}
											<span dangerouslySetInnerHTML={{__html: captcha.data}}/>
											<ResetCaptchaButton loadSvgCaptcha={loadSvgCaptcha}/>
										</>
									)}
								</Grid>
						}
					</Grid>
					<div className={classes.btnContainer}>
						<Button disabled={isAuthenticated ? activeStep === 2 : activeStep === 0} onClick={handleBack}>
							Back
						</Button>
						{activeStep === steps.length - 1 ?
							null :
							<Button type="button" disabled={(pristine || !valid) || activeStep === steps.length - 1} variant="contained" color="primary" onClick={handleNext}>
								Next
							</Button>}
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
				formSyncErros: null
			},
			propTypes: {

			}
		};

		function withFormTitle({arr, publicationValues, clearFields}) {
			const comp = (
				<>
					{arr.map(item => (
						<Grid key={item.title} container spacing={2} direction="row">
							<div className={classes.formHead}>
								<Typography>
									{item.title}
								</Typography>
							</div>
							{item.title === 'Author Details' ?
								fieldArrayElement({data: item.fields, fieldName: 'authors', clearFields}) :
								publisherElement({array: item.fields, classes, clearFields, publicationIssnValues: publicationValues})}
						</Grid>

					))}
				</>
			);

			return {
				...comp
			};
		}
	}
));

function getSteps(fieldArray) {
	return fieldArray.map(item => Object.keys(item));
}

function mapStateToProps(state) {
	return ({
		captcha: state.common.captcha,
		user: state.login.userInfo,
		isAuthenticated: state.login.isAuthenticated,
		publicationValues: getFormValues('issnRegForm')(state)
	});
}

function getFieldArray() {
	const fields = [
		{
			publisherBasicInfo: [
				{
					name: 'name',
					type: 'text',
					label: 'Name*',
					width: 'half'
				},
				{
					name: 'postalAddress[address]',
					type: 'text',
					label: 'Address*',
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
					name: 'phone',
					type: 'text',
					label: 'Phone',
					width: 'half'
				},
				{
					name: 'publisherEmail',
					type: 'text',
					label: 'Publisher Email*',
					width: 'half'
				},
				{
					name: 'publisherLanguage',
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
					name: 'postalAddress[public]',
					type: 'checkbox',
					label: 'Public',
					width: 'half',
					info: 'Check to make your postal address available to public.'
				},
				{
					name: 'aliases',
					type: 'arrayString',
					label: 'Aliases',
					width: 'full',
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
			basicInformation: [
				{
					name: 'title',
					type: 'text',
					label: 'Title*',
					width: 'half'
				},
				{
					name: 'subtitle',
					type: 'text',
					label: 'Sub-Title',
					width: 'half'
				},
				{
					name: 'language',
					type: 'select',
					label: 'Select Language*',
					width: 'half',
					defaultValue: 'eng',
					options: [
						{label: 'English (Default Language)', value: 'eng'},
						{label: 'Suomi', value: 'fin'},
						{label: 'Svenska', value: 'swe'}
					]
				},
				{
					name: 'additionalDetails',
					type: 'text',
					label: 'Additional Details',
					width: 'half'
				},
				{
					name: 'manufacturer',
					type: 'text',
					label: 'Manufacturer',
					width: 'half'
				},
				{
					name: 'city',
					type: 'text',
					label: 'City*',
					width: 'half'
				}
			]
		},
		{
			Time: [
				{
					title: 'Time Details',
					fields: [
						{
							name: 'firstYear',
							type: 'number',
							label: 'FirstYear*',
							width: 'half'
						},
						{
							name: 'firstNumber',
							type: 'text',
							label: 'FirstNumber*',
							width: 'half'
						},
						{
							name: 'frequency',
							type: 'multiSelect',
							width: 'half',
							label: 'Frequency*',
							options: [
								{label: '', value: ''},
								{label: 'Yearly', value: 'yearly'},
								{label: 'Monthly', value: 'monthly'},
								{label: 'Weekly', value: 'weekly'},
								{label: 'Daily', value: 'daily'},
								{label: 'Bi-Yearly', value: 'bi-yearly'},
								{label: 'Quarterly', value: 'quarterly'},
								{label: 'Bi-Monthly', value: 'bi-monthly'},
								{label: 'Continuously', value: 'continuously'},
								{label: 'Irregular', value: 'irregular'}

							]
						},
						{
							name: 'type',
							type: 'multiSelect',
							width: 'half',
							label: 'Type*',
							options: [
								{label: '', value: ''},
								{label: 'Journal', value: 'journal'},
								{label: 'Newsletter', value: 'newsletter'},
								{label: 'Staff-magazine', value: 'staff-magazine'},
								{label: 'Membership-magazine', value: 'membership-magazine'},
								{label: 'Cartoon', value: 'cartoon'},
								{label: 'Newspaper', value: 'newspaper'},
								{label: 'Free-paper', value: 'free-paper'},
								{label: 'Monography', value: 'monography'}

							]
						},
						{
							name: 'formatDetails[format]',
							type: 'select',
							label: 'Format*',
							width: 'half',
							options: [
								{label: '', value: ''},
								{label: 'Printed', value: 'printed'},
								{label: 'CD', value: 'cd'},
								{label: 'Electronic', value: 'electronic'},
								{label: 'Printed and Electronic', value: 'printed-and-electronic'}
							]
						}
					]
				}
			]
		},
		{
			PreviousPublication: [
				{
					title: 'Previous Publication',
					fields: [
						{
							name: 'previousPublication[lastYear]',
							type: 'number',
							label: 'Last Year',
							width: 'full'
						},
						{
							name: 'previousPublication[lastNumber]',
							type: 'text',
							label: 'Last Number',
							width: 'full'
						},
						{
							name: 'previousPublication[title]',
							type: 'text',
							label: 'Title',
							width: 'half'
						},
						{
							name: 'previousPublication[identifier]',
							type: 'text',
							label: 'Identifier',
							width: 'half'
						}
					]
				},
				{
					title: 'Other Medium',
					fields: [
						{
							name: 'otherMedium[title]',
							type: 'text',
							label: 'Title',
							width: 'half'
						},
						{
							name: 'otherMedium[identifier]',
							type: 'text',
							label: 'Identifier',
							width: 'half'
						}
					]
				}
			]
		},
		{
			SeriesDetails: [
				{
					title: 'Main Series',
					fields: [
						{
							name: 'seriesDetails[mainSeries[title]]',
							type: 'text',
							label: 'Title',
							width: 'half'
						},
						{
							name: 'seriesDetails[mainSeries[identifier]]',
							type: 'text',
							label: 'Identifier',
							width: 'half'
						}
					]
				},
				{
					title: 'Sub Series',
					fields: [
						{
							name: 'seriesDetails[subSeries[title]]',
							type: 'text',
							label: 'Title',
							width: 'half'
						},
						{
							name: 'seriesDetails[subSeries[identifier]]',
							type: 'text',
							label: 'Identifier',
							width: 'half'
						}
					]
				}
			]
		},
		{
			preview: 'preview'
		}
	];

	return fields;
}
