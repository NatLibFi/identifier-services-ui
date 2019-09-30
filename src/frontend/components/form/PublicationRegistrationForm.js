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
import renderRadioButton from './render/renderRadioButton';
import renderDateTime from './render/renderDateTime';
import ListComponent from '../ListComponent';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publicationRegistrationForm',
	initialValues: {
		language: 'eng',
		isPublic: false
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
			isAuthenticated,
			publicationCreationRequest,
			setMessage,
			handleSubmit,
			handleClose
		} = props;
		const [publisher, setPublisher] = useState('');
		const fieldArray = getFieldArray(user);
		const classes = useStyles();
		const [activeStep, setActiveStep] = useState(0);
		const [captchaInput, setCaptchaInput] = useState('');
		const [publisherRegForm, setPublisherRegForm] = useState(true);
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
						return withFormTitle(fieldArray[2].Authors, publicationValues, clearFields);
					case 3:
						return withFormTitle(fieldArray[3].Series, publicationValues, clearFields);
					case 4:
						return element(fieldArray[4].formatDetails, 'formatDetails', publicationValues, clearFields);
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
					return withFormTitle(fieldArray[x + 1].Authors, publicationValues, clearFields);
				case x + 2:
					return withFormTitle(fieldArray[x + 2].Series, publicationValues, clearFields);
				case x + 3:
					return element(fieldArray[x + 3].formatDetails, 'formatDetails', publicationValues, clearFields);
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

		function replaceKey(key) {
			switch (key) {
				case 'role':
					return 'role';
				case 'authorGivenName':
					return 'givenName';
				case 'authorFamilyName':
					return 'familyName';
				default:
					return null;
			}
		}

		async function handlePublicationRegistration(values) {
			if (isAuthenticated) {
				publicationCreationRequest(formatPublicationValues(values));
			} else {
				// eslint-disable-next-line no-lonely-if
				if (captchaInput.length === 0) {
					setMessage({color: 'error', msg: 'Captcha not provided'});
				} else if (captchaInput.length > 0) {
					const result = await postCaptchaInput(captchaInput, captcha.id);
					submitPublication(formatPublicationValues(values), result);
				}
			}

			handleClose();
		}

		function formatPublicationValues(values) {
			const formatAuthors = values.authors.map(item => Object.keys(item).reduce((acc, key) => {
				return {...acc, [replaceKey(key)]: item[key]};
			}, {}));
			const {seriesTitle, ...formatTitle} = {
				...values.seriesDetails,
				volume: values.seriesDetails.volume && Number(values.seriesDetails.volume),
				title: values.seriesDetails.seriesTitle
			};
			const {select, selectFormat, ...formattedPublicationValue} = {
				...values,
				authors: formatAuthors,
				publisher: isAuthenticated ? user.id : publisher,
				seriesDetails: formatTitle,
				formatDetails: values.formatDetails.fileFormat ?
					{...values.formatDetails, fileFormat: values.formatDetails.fileFormat.value} :
					{...values.formatDetails,
						run: values.formatDetails.run && Number(values.formatDetails.run),
						edition: values.formatDetails.edition && Number(values.formatDetails.edition)}
			};
			return formattedPublicationValue;
		}

		function submitPublication(values, result) {
			if (result === true) {
				publicationCreationRequest(values);
			} else {
				setMessage({color: 'error', msg: 'Please type the correct word in the image below'});
				loadSvgCaptcha();
			}
		}

		function renderPreview(publicationValues) {
			publicationValues = {...publicationValues, publicationTime: publicationValues.publicationTime.toLocaleString()};
			const formatPublicationValue = formatPublicationValues(publicationValues);
			return (
				<>
					<Grid item xs={12} md={6}>
						<List>
							{
								Object.keys(formatPublicationValue).map(key => {
									return (typeof formatPublicationValue[key] === 'string' || typeof formatPublicationValue[key] === 'boolean') ?
										(
											<ListComponent label={key} value={formatPublicationValue[key]}/>
										) :
										null;
								})
							}
						</List>
					</Grid>
					<Grid item xs={12} md={6}>
						<List>
							{
								Object.keys(formatPublicationValue).map(key => {
									if (typeof formatPublicationValue[key] === 'object') {
										if (Array.isArray(formatPublicationValue[key])) {
											return <ListComponent label={key} value={formatPublicationValue[key]}/>;
										}

										const obj = formatPublicationValue[key];
										Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : '');
										return <ListComponent label={key} value={obj}/>;
									}

									return null;
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

		function element(array, fieldName, publicationValues) {
			// eslint-disable-next-line complexity
			return array.map(list => {
				switch (list.type) {
					case 'select':
						if (list.name === 'type') {
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
									{publicationValues && (publicationValues.type === 'map') ? element(getScale()) : null}
								</>
							);
						}

						return (
							<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
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
							<Grid key={list.name} item xs={12}>
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
						if (fieldName === 'formatDetails') {
							return (
								<>
									<Grid key={list.name} item xs={12}>
										<Field
											value={publicationValues && publicationValues.selectFormat}
											component={renderRadioButton}
											name={list.name}
											type={list.type}
											options={list.options}
											props={{className: classes.radioDirectionRow, publicationValues: publicationValues, clearFields: clearFields}}
										/>
									</Grid>
									{publicationValues && publicationValues.selectFormat && subElementFormatDetails(publicationValues.selectFormat)}
								</>
							);
						}

						return (
							<Grid key={list.name} item xs={12}>
								<>
									<Field
										value={publicationValues && publicationValues.select}
										component={renderRadioButton}
										name={list.name}
										type={list.type}
										options={list.options}
										props={{className: classes.radioDirectionRow, publicationValues: publicationValues, clearFields: clearFields}}
									/>
									{ publicationValues && publicationValues.select ?
										<Field
											className={`${classes.textField} ${list.width}`}
											component={renderTextField}
											label={publicationValues && publicationValues.select}
											name={publicationValues && `seriesDetails[${publicationValues.select}]`}
											type="text"
										/> : null

									}
								</>

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
			props={{clearFields, data, fieldName, formName: 'publicationRegistrationForm'}}
		/>
	);
}

function mapStateToProps(state) {
	return ({
		captcha: state.common.captcha,
		user: state.login.userInfo,
		isAuthenticated: state.login.isAuthenticated,
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
					name: 'publicationTime',
					type: 'dateTime',
					label: 'Publication Time*',
					width: 'half'
				},
				{
					name: 'type',
					type: 'select',
					label: 'Type',
					width: 'half',
					options: [
						{label: '', value: ''},
						{label: 'Book', value: 'book'},
						{label: 'Map', value: 'map'},
						{label: 'Dissertation', value: 'dissertation'},
						{label: 'Music', value: 'music'},
						{label: 'Other', value: 'other'}
					]
				},
				{
					name: 'isPublic',
					type: 'checkbox',
					label: 'Is Public',
					width: 'full'
				}
			]
		},
		{
			Authors: [
				{
					title: 'Author Details',
					fields: [
						{
							name: 'authorGivenName',
							type: 'text',
							label: 'Given Name*',
							width: 'half'
						},
						{
							name: 'authorFamilyName',
							type: 'text',
							label: 'Family Name*',
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
					]
				}
			]
		},
		{
			Series: [
				{
					title: 'Series Details',
					fields: [
						{
							name: 'seriesDetails[volume]',
							type: 'number',
							label: 'Volume',
							width: 'full'
						},
						{
							name: 'select',
							type: 'radio',
							label: 'Select*',
							width: 'full',
							options: [
								{label: 'Title', value: 'seriesTitle'},
								{label: 'Identifier', value: 'identifier'}
							]
						}
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
					type: 'select',
					width: 'half',
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
					width: 'half'
				},
				{
					label: 'city',
					name: 'formatDetails[city]',
					type: 'text',
					width: 'half'
				},
				{
					label: 'Run',
					name: 'formatDetails[run]',
					type: 'number',
					width: 'half'
				},
				{
					label: 'Edition',
					name: 'formatDetails[edition]',
					type: 'number',
					width: 'half'
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
					type: 'select',
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
					width: 'half'
				},
				{
					label: 'city',
					name: 'formatDetails[city]',
					type: 'text',
					width: 'half'
				},
				{
					label: 'Run',
					name: 'formatDetails[run]',
					type: 'number',
					width: 'half'
				},
				{
					label: 'Edition',
					name: 'formatDetails[edition]',
					type: 'number',
					width: 'half'
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
			width: 'half'
		}
	];
}
