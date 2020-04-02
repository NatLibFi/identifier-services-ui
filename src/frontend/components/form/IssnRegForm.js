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
import {Field, FieldArray, reduxForm, getFormValues} from 'redux-form';
import {validate} from '@natlibfi/identifier-services-commons';
import {Button, Grid, Stepper, Step, StepLabel, Typography, List} from '@material-ui/core';
import {connect} from 'react-redux';
import HttpStatus from 'http-status';
import {useCookies} from 'react-cookie';

import * as actions from '../../store/actions';
import useStyles from '../../styles/form';
import renderTextField from './render/renderTextField';
import renderCheckbox from './render/renderCheckbox';
import renderSelect from './render/renderSelect';
import Captcha from '../Captcha';
import renderFieldArray from './render/renderFieldArray';
import {fieldArray as publisherFieldArray} from './PublisherRegistrationForm';
import PublisherRegistrationForm from './PublisherRegistrationForm';
import renderMultiSelect from './render/renderMultiSelect';
import renderDateTime from './render/renderDateTime';
import ListComponent from '../ListComponent';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'issnRegForm',
	initialValues: {
		language: 'eng'
	},
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
			handleSubmit} = props;
		const [publisher, setPublisher] = useState('');
		const fieldArray = getFieldArray(user);
		const classes = useStyles();
		const [activeStep, setActiveStep] = useState(0);
		const [captchaInput, setCaptchaInput] = useState('');
		const [publisherRegForm, setPublisherRegForm] = useState(true);
		/* global COOKIE_NAME */
		const [cookie] = useCookies(COOKIE_NAME);
		const steps = getSteps(fieldArray);
		useEffect(() => {
			if (!isAuthenticated) {
				loadSvgCaptcha();
			}
		}, [isAuthenticated, loadSvgCaptcha, publisher]);

		function getStepContent(step) {
			if (user.id === undefined) {
				switch (step) {
					case 0:
						return (
							<>
								<Typography className={classes.fullWidth} variant="h6" align="center">Publisher Details</Typography>
								<PublisherRegistrationForm
									publicationRegistration
									handleSetPublisher={handleSetPublisher}
									setPublisherRegForm={setPublisherRegForm}
								/>
							</>
						);
					case 1:
						return element(fieldArray[1].basicInformation, undefined, publicationValues);
					case 2:
						return withFormTitle(fieldArray[2].Time, publicationValues, clearFields);
					case 3:
						return withFormTitle(fieldArray[3].PreviousPublication, publicationValues, clearFields);
					case 4:
						return withFormTitle(fieldArray[4].SeriesDetails, publicationValues, clearFields);
					case 5:
						return renderPreview(publicationValues);
					default:
						return 'Unknown step';
				}
			}

			return run(step, 0);
		}

		function run(step, x) {
			switch (step) {
				case x:
					return element(fieldArray[x].basicInformation, undefined, publicationValues);
				case x + 1:
					return withFormTitle(fieldArray[x + 1].Time, publicationValues, clearFields);
				case x + 2:
					return withFormTitle(fieldArray[x + 2].PreviousPublication, publicationValues, clearFields);
				case x + 3:
					return withFormTitle(fieldArray[3].SeriesDetails, publicationValues, clearFields);
				case x + 4:
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

		function handleSetPublisher(value) {
			handleNext();
			setPublisher(value);
			setPublisherRegForm(true);
		}

		async function handlePublicationRegistration(values) {
			if (isAuthenticated) {
				const result = await publicationCreation({values: formatPublicationValues(values), token: cookie[COOKIE_NAME], subType: 'issn'});
				if (result === HttpStatus.CREATED) {
					handleClose();
					setIsCreating(true);
				}
			} else if (captchaInput.length === 0) {
				setMessage({color: 'error', msg: 'Captcha not provided'});
			} else if (captchaInput.length > 0) {
				const result = await postCaptchaInput(captchaInput, captcha.id);
				submitPublication(formatPublicationValues(values), result);
			}
		}

		function formatPublicationValues(values) {
			const formattedPublicationValues = {
				...values,
				publisher: isAuthenticated ? user.publisher : publisher,
				firstNumber: Number(values.firstNumber),
				firstYear: Number(values.firstYear),
				frequency: values.frequency.value,
				previousPublication: {
					...values.previousPublication,
					lastYear: Number(values.previousPublication.lastYear),
					lastNumber: Number(values.previousPublication.lastNumber)
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
				}
			} else {
				setMessage({color: 'error', msg: 'Please type the correct word in the image below'});
				loadSvgCaptcha();
			}
		}

		function renderPreview(publicationValues) {
			const values = formatPublicationValues(publicationValues);
			const {seriesDetails, publisher, ...formatValues} = {...values, mainSeries: values.seriesDetails.mainSeries, subSeries: values.seriesDetails.subSeries};
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
								<Grid item xs={12}>
									{isAuthenticated ? null : (
										<>
											<Captcha
												captchaInput={captchaInput}
												handleCaptchaInput={handleCaptchaInput}
												className={classes.captcha}/>
											{/* eslint-disable-next-line react/no-danger */}
											<span dangerouslySetInnerHTML={{__html: captcha.data}}/>
										</>
									)}
								</Grid>
						}
					</Grid>
					{
						publisherRegForm ?
							(
								<div className={classes.btnContainer}>
									<Button disabled={activeStep === 0} onClick={handleBack}>
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
							) :
							null
					}
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

		function element(array, fieldName, publicationValues) {
			return array.map(list => {
				switch (list.type) {
					case 'select':
						return (
							<>
								<Grid key={list.name} item xs={6}>
									<form>
										<Field
											className={`${classes.selectField} ${list.width}`}
											component={renderSelect}
											label={list.label}
											name={list.name}
											type={list.type}
											options={list.options}
											props={{publicationValues: publicationValues, clearFields: clearFields}}
										/>
									</form>
								</Grid>

								{publicationValues && publicationValues.formatDetails && publicationValues.formatDetails.format === 'electronic' ? element(getUrl()) : null}
							</>
						);

					case 'text':
						return (
							<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
								<Field
									className={`${classes.textField} ${list.width}`}
									component={renderTextField}
									label={list.label}
									name={list.name}
									type={list.type}
									disabled={Boolean(list.name === 'publisher')}
								/>
							</Grid>
						);
					case 'number':
						return (
							<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
								<Field
									className={`${classes.textField} ${list.width}`}
									component={renderTextField}
									label={list.label}
									name={list.name}
									type={list.type}
									disabled={Boolean(list.name === 'publisher')}
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
					case 'dateTime':
						return (
							<Grid key={list.name} item xs={6}>
								<Field
									className={classes.dateTimePicker}
									component={renderDateTime}
									label={list.label}
									name={list.name}
									type={list.type}
								/>
							</Grid>
						);
					case 'multiSelect':
						return (
							<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
								<Field
									className={`${classes.selectField} ${list.width}`}
									component={renderMultiSelect}
									label={list.label}
									name={list.name}
									type={list.type}
									options={list.options}
									props={{isMulti: false}}
								/>
							</Grid>
						);
					default:
						return null;
				}
			});
		}

		function withFormTitle(arr, publicationValues, clearFields) {
			return (
				<>
					{arr.map(item => (
						<Grid key={item.title} container spacing={2} direction="row">
							<div className={classes.formHead}>
								<Typography>
									{item.title}
								</Typography>
							</div>
							{item.title === 'Author Details' ? fieldArrayElement(item.fields, 'authors', clearFields) : element(item.fields, undefined, publicationValues, clearFields)}
						</Grid>

					))}
				</>
			);
		}
	}
));

function getSteps(fieldArray) {
	return fieldArray.map(item => Object.keys(item));
}

function fieldArrayElement(data, fieldName, clearFields) {
	return (
		<FieldArray
			name={fieldName}
			component={renderFieldArray}
			props={{clearFields, data, fieldName, formName: 'issnRegForm'}}
		/>
	);
}

function mapStateToProps(state) {
	return ({
		captcha: state.common.captcha,
		user: state.login.userInfo,
		isAuthenticated: state.login.isAuthenticated,
		publisherValues: getFormValues('publisherRegistrationForm')(state),
		publicationValues: getFormValues('issnRegForm')(state)
	});
}

function getFieldArray(user) {
	const fieldsWithUser = [
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
							label: 'FirstYear',
							width: 'half'
						},
						{
							name: 'firstNumber',
							type: 'number',
							label: 'FirstNumber*',
							width: 'half'
						},
						{
							name: 'frequency',
							type: 'multiSelect',
							width: 'half',
							label: 'Frequency',
							options: [
								{label: '', value: ''},
								{label: 'Yearly', value: 'yearly'},
								{label: 'Monthly', value: 'monthly'},
								{label: 'Weekly', value: 'weekly'},
								{label: 'Daily', value: 'daily'},
								{label: 'Bi-Yearly', value: 'bi-yearly'},
								{label: 'Quarterly', value: 'Quarterly'},
								{label: 'Bi-Monthly', value: 'bi-monthly'},
								{label: 'Continuously', value: 'continuously'},
								{label: 'Irregular', value: 'irregular'}

							]
						},
						{
							name: 'type',
							type: 'multiSelect',
							width: 'half',
							label: 'Type',
							options: [
								{label: '', value: ''},
								{label: 'Yearly', value: 'yearly'},
								{label: 'Monthly', value: 'monthly'},
								{label: 'Weekly', value: 'weekly'},
								{label: 'Daily', value: 'daily'},
								{label: 'Bi-Yearly', value: 'bi-yearly'},
								{label: 'Quarterly', value: 'Quarterly'},
								{label: 'Bi-Monthly', value: 'bi-monthly'},
								{label: 'Continuously', value: 'continuously'},
								{label: 'Irregular', value: 'irregular'}

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
								{label: 'Electronic', value: 'electronic'}
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
							type: 'number',
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
	const fieldsWithoutUser = [{publisher: publisherFieldArray}];
	return user.id === undefined ? [...fieldsWithoutUser, ...fieldsWithUser] : fieldsWithUser;
}

function getUrl() {
	return [
		{
			label: 'URL*',
			name: 'formatDetails[url]',
			type: 'text',
			width: 'half'
		}
	];
}
