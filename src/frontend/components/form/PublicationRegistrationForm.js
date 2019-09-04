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

/* eslint-disable no-alert */
/* global alert */

import React, {useState, useEffect} from 'react';
import {Field, FieldArray, reduxForm, getFormValues} from 'redux-form';
import {validate} from '@natlibfi/identifier-services-commons';
import {Button, Grid, Stepper, Step, StepLabel, Typography} from '@material-ui/core';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';
import useStyles from '../../styles/form';
import renderTextField from './render/renderTextField';
import renderCheckbox from './render/renderCheckbox';
import renderSelect from './render/renderSelect';
import Captcha from '../Captcha';
import renderFieldArray from './render/renderFieldArray';
import {fieldArray as publisherFieldArray} from './PublisherRegistrationForm';
import PublisherRegistrationForm from './PublisherRegistrationForm';
import RenderHelper from './render/renderHelper';
import renderMultiSelect from './render/renderMultiSelect';
import renderRadioButton from './render/renderRadioButton';
import RenderPublicationPreview from '../publication/RenderPreview';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publicationRegistrationForm',
	initialValues: {
		language: 'eng',
		isPublic: false
	},
	validate,
	enableReinitialize: true
})(
	props => {
		const {loadSvgCaptcha, captcha, pristine, valid, postCaptchaInput, publicationValues, clearFields, publisherValues, user, handleSubmit} = props;
		const [publisher, setPublisher] = useState('');
		const [newPublication, setNewPublication] = useState({});
		const [formatDetails, setFormatDetails] = useState('');
		const [selectType, setSelectType] = useState('');
		const fieldArray = getFieldArray(user);
		const classes = useStyles();
		const [activeStep, setActiveStep] = useState(0);
		const [captchaInput, setCaptchaInput] = useState('');
		const [publisherRegForm, setPublisherRegForm] = useState(true);
		const steps = getSteps(fieldArray);

		useEffect(() => {
			loadSvgCaptcha();
		}, [loadSvgCaptcha, publisher]);

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
						return element(fieldArray[1].basicInformation, undefined, user);
					case 2:
						return (
							<>
								{fieldArrayElement(fieldArray[2].authors, 'authors')}
								{element(fieldArray[2].seriesDetails, undefined, user)}
							</>
						);
					case 3:
						return element(fieldArray[3].formatDetails, 'formatDetails');
					case 4:
						return <RenderPublicationPreview data={{...publicationValues, publisher: publisher}}/>;
					default:
						return 'Unknown step';
				}
			}

			return run(step, 0);
		}

		function run(step, x) {
			switch (step) {
				case x:
					return element(fieldArray[x].basicInformation, undefined, user);
				case x + 1:
					return (
						<>
							{fieldArrayElement(fieldArray[x + 1].authors, 'authors')}
							{element(fieldArray[x + 1].seriesDetails, undefined, user)}
						</>
					);
				case x + 2:
					return element(fieldArray[x + 2].formatDetails, 'formatDetails', user);
				case x + 3:
					return <RenderPublicationPreview data={publicationValues}/>;
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

		function handleSetPublisher() {
			handleNext();
			setPublisher(publisherValues);
			setPublisherRegForm(true);
		}

		async function handlePublicationRegistration(values) {
			if (captchaInput.length === 0) {
				alert('Captcha not provided');
			} else if (captchaInput.length > 0) {
				const result = await postCaptchaInput(captchaInput, captcha.id);
				setNewPublication(makeNewPublicationObj(values, result));
				console.log(newPublication);
			}
		}

		function makeNewPublicationObj(values, result) {
			if (result) {
				return {
					...values,
					publisher: values.publisher === undefined ? publisher : values.publisher
				};
			}

			alert('Please type the correct word in the image below');
			loadSvgCaptcha();
		}

		const component = (
			<form className={classes.container} onSubmit={handleSubmit(handlePublicationRegistration)}>
				{console.log('3456444232', publicationValues)}
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
								<Captcha
									captchaInput={captchaInput}
									handleCaptchaInput={handleCaptchaInput}/>
								{/* eslint-disable-next-line react/no-danger */}
								<span dangerouslySetInnerHTML={{__html: captcha.data}}/>
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
										</Button>
									}
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

		function element(array, fieldName, user) {
			return array.map(list => {
				switch (list.type) {
					case 'select':
						return (
							<Grid key={list.name} item xs={6}>
								{list.name === 'type' ?
									(
										<>
											<form>
												<Field
													className={`${classes.selectField} ${list.width}`}
													component={renderSelect}
													label={list.label}
													name={list.name}
													type={list.type}
													options={list.options}
													props={{isMulti: false}}
													onChange={(e, values) => setSelectType(values)}
												/>
											</form>
											{selectType === 'map' ? element(getScale()) : null}
										</>
									) :
									(
										<Field
											className={`${classes.selectField} ${list.width}`}
											component={renderSelect}
											label={list.label}
											name={list.name}
											type={list.type}
											options={list.options}
										/>
									)
								}
							</Grid>
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
									props={{defaultValue: (list.name === 'publisher' && user.id !== undefined) ? user.id : null}}
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
									props={{isMulti: false}}
								/>
							</Grid>
						);
					case 'radio':
						return (
							<Grid key={list.name} item xs={6}>
								{fieldName === 'formatDetails' ?
									(
										<>
											<form>
												<Field
													component={renderRadioButton}
													name={list.name}
													type={list.type}
													options={list.options}
													onChange={(e, values) => setFormatDetails(values)}
												/>
											</form>
											{subElementFormatDetails(formatDetails)}
										</>
									) :
									(
										// eslint-disable-next-line react/style-prop-object
										<RenderHelper clearFields={clearFields} list={list} style="radioDirectionRow"/>
									)
								}
							</Grid>
						);
					default:
						return null;
				}
			});
		}

		function subElementFormatDetails(value) {
			const array = getSubFormatDetailsFieldArray();
			switch (value) {
				case 'electronic':
					return element(array[0].electronic, 'electronic');
				case 'printed':
					return element(array[1].printed, 'printed');
				case 'both':
					return element(array[2].both, 'both');
				default:
					return null;
			}
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
			props={{clearFields, data, fieldName, formName: 'publicationRegistrationForm'}}
		/>
	);
}

function mapStateToProps(state) {
	return ({
		captcha: state.common.captcha,
		user: state.login.userInfo,
		publisherValues: getFormValues('publisherRegistrationForm')(state),
		publicationValues: getFormValues('publicationRegistrationForm')(state)
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
					name: 'additionalDetails',
					type: 'text',
					label: 'Additional Details',
					width: 'half'
				},
				{
					name: 'publicationTime',
					type: 'text',
					label: 'Publication Time*',
					width: 'half'
				},
				{
					name: 'isPublic',
					type: 'checkbox',
					label: 'Is Public*',
					width: 'full'
				},
				{
					name: 'publisher',
					type: 'text',
					label: 'Publisher',
					width: 'half'
				},
				{
					name: 'type',
					type: 'select',
					label: 'Type',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'Book', value: 'book'},
						{label: 'Map', value: 'map'},
						{label: 'Dissertation', value: 'dissertation'},
						{label: 'Music', value: 'music'},
						{label: 'Other', value: 'other'}
					]
				}
			]
		},
		{
			authors: [
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
					name: 'role',
					type: 'select',
					label: 'Role*',
					width: 'half',
					options: [
						{label: '', value: ''},
						{label: 'Author', value: 'author'},
						{label: 'Illustrator', value: 'illustrator'},
						{label: 'Translator', value: 'translator'},
						{label: 'Editor', value: 'editor'}
					]
				}
			],

			seriesDetails: [
				{
					name: 'volume',
					type: 'text',
					label: 'Volume',
					width: 'full'
				},
				{
					name: 'select',
					type: 'radio',
					label: 'Select*',
					width: 'full',
					options: [
						{label: 'Title', value: 'title'},
						{label: 'Identifier', value: 'identifier'}
					]
				}
			]
		},
		{
			formatDetails: [
				{
					name: 'selectFormat',
					type: 'radio',
					width: 'full',
					options: [
						{label: 'Electronic', value: 'electronic'},
						{label: 'Printed', value: 'printed'},
						{label: 'Both', value: 'both'}
					]
				}
			]
		},
		{
			preview: 'preview'
		}
	];
	const fieldsWithoutUser = [{publisher: publisherFieldArray}];
	return user.id === undefined ? fieldsWithoutUser.concat(fieldsWithUser) : fieldsWithUser;
}

function getSubFormatDetailsFieldArray() {
	const array = [
		{
			electronic: [
				{
					label: 'Fileformat*',
					name: 'formatDetails[fileFormat]',
					type: 'multiSelect',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'Pdf', value: 'pdf'},
						{label: 'Epub', value: 'epbu'},
						{label: 'CD', value: 'cd'}
					]
				},
				{
					label: 'Format*',
					name: 'formatDetails[format]',
					type: 'select',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'Electronic', value: 'electronic'}
					]
				}
			]
		},
		{
			printed: [
				{
					label: 'PrintFormat*',
					name: 'formatDetails[printFormat]',
					type: 'multiSelect',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'paperback', value: 'paperback'},
						{label: 'hardback', value: 'hardback'},
						{label: 'spiral-binding', value: 'spiral-binding'}
					]
				},
				{
					label: 'Manufacturer',
					name: 'formatDetails[manufacturer]',
					type: 'text',
					width: 'full'
				},
				{
					label: 'city',
					name: 'formatDetails[city]',
					type: 'text',
					width: 'full'
				},
				{
					label: 'Run',
					name: 'formatDetails[run]',
					type: 'text',
					width: 'full'
				},
				{
					label: 'Edition',
					name: 'formatDetails[edition]',
					type: 'text',
					width: 'full'
				},
				{
					label: 'Format*',
					name: 'formatDetails[format]',
					type: 'select',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'Printed', value: 'printed'}
					]
				}
			]
		},
		{
			both: [
				{
					label: 'Fileformat*',
					name: 'formatDetails[fileFormat]',
					type: 'multiSelect',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'Pdf', value: 'pdf'},
						{label: 'Epub', value: 'epbu'},
						{label: 'CD', value: 'cd'}
					]
				},
				{
					label: 'PrintFormat*',
					name: 'formatDetails[printFormat]',
					type: 'multiSelect',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'paperback', value: 'paperback'},
						{label: 'hardback', value: 'hardback'},
						{label: 'spiral-binding', value: 'spiral-binding'}
					]
				},
				{
					label: 'Manufacturer',
					name: 'formatDetails[manufacturer]',
					type: 'text',
					width: 'full'
				},
				{
					label: 'city',
					name: 'formatDetails[city]',
					type: 'text',
					width: 'full'
				},
				{
					label: 'Run',
					name: 'formatDetails[run]',
					type: 'text',
					width: 'full'
				},
				{
					label: 'Edition',
					name: 'formatDetails[edition]',
					type: 'text',
					width: 'full'
				},
				{
					label: 'Format*',
					name: 'formatDetails[format]',
					type: 'select',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'Printed And Electronic', value: 'printed-and-electronic'}
					]
				}
			]
		}
	];
	return array;
}

function getScale() {
	return [
		{
			label: 'Scale',
			name: 'mapDetails[scale]',
			type: 'text',
			width: 'full'
		}
	];
}
