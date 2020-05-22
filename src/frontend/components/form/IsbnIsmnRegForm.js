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
import {reduxForm, getFormValues, Field} from 'redux-form';
import {validate} from '@natlibfi/identifier-services-commons';
import {Button, Grid, Stepper, Step, StepLabel, Typography, List} from '@material-ui/core';
import {connect} from 'react-redux';
import {useCookies} from 'react-cookie';
import HttpStatus from 'http-status';
import * as actions from '../../store/actions';
import useStyles from '../../styles/form';
import ResetCaptchaButton from './ResetCaptchaButton';
import Captcha from '../Captcha';
import {element, fieldArrayElement, formatLabel} from './publisherRegistrationForm/commons';
import ListComponent from '../ListComponent';
import renderSelectAutoComplete from './render/renderSelectAutoComplete';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'isbnIsmnRegForm',
	initialValues: {
		language: 'eng',
		publisherLanguage: 'eng',
		insertUniversity: false
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
			publicationCreation,
			publicationCreationRequest,
			getUniversityPublisher,
			universityPublisher,
			setMessage,
			handleClose,
			setIsCreating,
			handleSubmit,
			reset
		} = props;
		const fieldArray = getFieldArray(user);
		const dissFieldArray = getDissertationFieldArray();
		const classes = useStyles();
		const [activeStep, setActiveStep] = useState(0);
		const [captchaInput, setCaptchaInput] = useState('');
		const [typeSelect, setTypeSelect] = useState(true);
		/* global COOKIE_NAME */
		const [cookie] = useCookies(COOKIE_NAME);

		if (publicationValues && publicationValues.type && publicationValues.type.value === 'map') {
			fieldArray[4].basicInformation.push({
				label: 'Scale',
				name: 'mapDetails[scale]',
				type: 'text',
				width: 'half'
			});
		}

		if (publicationValues && publicationValues.type && publicationValues.type.value !== 'dissertation') {
			fieldArray[4].basicInformation.push({
				name: 'isbnClassification',
				type: 'multiSelect',
				width: 'half',
				label: 'Classification',
				isMulti: true,
				isCreatable: false,
				options: [
					{label: 'Non-Fiction', value: 1},
					{label: 'Fiction', value: 2},
					{label: 'Cartoon', value: 3},
					{label: 'Children Book', value: 4}
				]
			});
		}

		const steps = getSteps(fieldArray, dissFieldArray);

		useEffect(() => {
			if (!isAuthenticated) {
				loadSvgCaptcha();
				getUniversityPublisher();
			}
		}, [isAuthenticated, loadSvgCaptcha]);

		function getStepContent(step) {
			if (isAuthenticated) {
				switch (step) {
					case 0:
						return element({array: fieldArray[4].basicInformation, classes, clearFields, publicationIsbnValues: publicationValues});
					case 1:
						return withFormTitle({arr: fieldArray[5].Authors, publicationValues, clearFields, formName: 'isbnIsmnRegForm'});
					case 2:
						return withFormTitle({arr: fieldArray[6].Series, publicationValues, clearFields});
					case 3:
						return element({array: fieldArray[7].formatDetails, fieldName: 'formatDetails', publicationIsbnValues: publicationValues, classes, clearFields});
					case 4:
						return renderPreview(publicationValues);
					default:
						return 'Unknown step';
				}
			}

			if (!isAuthenticated && publicationValues.type.value !== 'dissertation') {
				switch (step) {
					case 0:
						return element({array: fieldArray[0].publisherBasicInfo, classes, clearFields});
					case 1:
						return element({array: fieldArray[1].publishingActivities, classes, clearFields});
					case 2:
						return fieldArrayElement({data: fieldArray[2].primaryContact, fieldName: 'primaryContact', clearFields});
					case 3:
						return element({array: fieldArray[4].basicInformation, classes, clearFields, publicationIsbnValues: publicationValues});
					case 4:
						return withFormTitle({arr: fieldArray[5].Authors, publicationValues, clearFields, formName: 'isbnIsmnRegForm'});
					case 5:
						return withFormTitle({arr: fieldArray[6].Series, publicationValues, clearFields});
					case 6:
						return element({array: fieldArray[7].formatDetails, fieldName: 'formatDetails', publicationIsbnValues: publicationValues, classes, clearFields});
					case 7:
						return renderPreview(publicationValues);
					default:
						return 'Unknown step';
				}
			}

			if (!isAuthenticated && publicationValues.type.value === 'dissertation') {
				switch (step) {
					case 0:
						return publicationValues.insertUniversity ?
							<>{element({array: dissertCheckBox(), classes})}{element({array: dissFieldArray[0].UniversityInfo, classes})}</> :
							<>{element({array: searchPublisherComponent(), classes})}{element({array: dissertCheckBox(), classes})}</>;
					case 1:
						return element({array: fieldArray[3].contactInfo, classes});
					case 2:
						return element({array: fieldArray[4].basicInformation, classes, clearFields, publicationIsbnValues: publicationValues});
					case 3:
						return withFormTitle({arr: fieldArray[5].Authors, publicationValues, clearFields, formName: 'isbnIsmnRegForm'});
					case 4:
						return withFormTitle({arr: fieldArray[6].Series, publicationValues, clearFields});
					case 5:
						return element({array: fieldArray[7].formatDetails, fieldName: 'formatDetails', publicationIsbnValues: publicationValues, classes, clearFields});
					case 6:
						return renderPreview(publicationValues);
					default:
						return 'Unknown step';
				}
			}
		}

		const handleContinueClick = () => {
			setTypeSelect(!typeSelect);
		};

		const handleCaptchaInput = e => {
			setCaptchaInput(e.target.value);
		};

		function handleNext() {
			setActiveStep(activeStep + 1);
		}

		function handleBack() {
			if (activeStep === 0 || (isAuthenticated && activeStep === 5)) {
				setTypeSelect(!typeSelect);
			} else {
				setActiveStep(activeStep - 1);
			}
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
				const result = await publicationCreation({values: formatPublicationValues(values), token: cookie[COOKIE_NAME], subType: 'isbn-ismn'});
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
			const dissertPublisher = !isAuthenticated && (publicationValues.type.value === 'dissertation' ?
				{
					givenName: values.givenName,
					familyName: values.familyName,
					address: values.address,
					zip: values.zip,
					city: values.city,
					country: values.country,
					phone: values.phone,
					email: values.email,
					university: values.selectUniversity ? {name: values.selectUniversity.title, city: values.selectUniversity.place} :
						{name: values.university.name, city: values.university.city}
				} :
				{
					name: values.name,
					postalAddress: values.postalAddress,
					publisherEmail: values.publisherEmail,
					phone: values.phone && values.phone,
					language: values.publisherLanguage,
					primaryContact: values.primaryContact,
					code: values.code && values.code,
					publicationDetails: {
						...values.publicationDetails,
						previouslyPublished: Boolean(values.publicationDetails.previouslyPublished),
						frequency: {
							currentYear: Number(values.publicationDetails.frequency.currentYear),
							nextYear: Number(values.publicationDetails.frequency.nextYear)
						}
					}
				});
			const publisher = isAuthenticated ? user.publisher : dissertPublisher;

			const formatAuthors = values.authors.map(item => Object.keys(item).reduce((acc, key) => {
				return {...acc, [replaceKey(key)]: item[key]};
			}, {}));

			function formatTitle() {
				const {seriesTitle, ...formatTitle} = values.seriesDetails && {
					...values.seriesDetails,
					volume: values.seriesDetails.volume && values.seriesDetails.volume,
					title: values.seriesDetails.seriesTitle && values.seriesDetails.seriesTitle
				};
				return formatTitle;
			}

			const map = values.mapDetails ? values.mapDetails : undefined;

			const {
				select,
				selectFormat,
				name,
				postalAddress,
				publisherEmail,
				phone,
				publisherLanguage,
				primaryContact,
				code,
				publicationDetails,
				insertUniversity,
				university,
				place,
				givenName,
				familyName,
				address,
				zip,
				city,
				country,
				email,
				...formattedPublicationValue
			} = {
				...values,
				publisher,
				authors: formatAuthors,
				seriesDetails: values.seriesDetails && formatTitle(),
				formatDetails: formatDetail(),
				type: values.type.value,
				isPublic: values.isPublic.value,
				isbnClassification: values.isbnClassification ? values.isbnClassification.map(item => item.value.toString()) : undefined,
				mapDetails: publicationValues.type.value === 'map' ? map : undefined
			};

			return formattedPublicationValue;

			function formatDetail() {
				if (values.selectFormat === 'electronic') {
					const formatDetails = {
						...values.formatDetails,
						format: 'electronic',
						fileFormat: values.formatDetails.fileFormat.value
					};
					return formatDetails;
				}

				if (values.selectFormat === 'printed') {
					const formatDetails = {
						...values.formatDetails,
						format: 'printed',
						run: values.formatDetails.run && Number(values.formatDetails.run),
						edition: values.formatDetails.edition && Number(values.formatDetails.edition)
					};
					return formatDetails;
				}

				if (values.selectFormat === 'both') {
					const formatDetails = {
						...values.formatDetails,
						format: 'printed-and-electronic',
						fileFormat: values.formatDetails.fileFormat.value,
						run: values.formatDetails.run && Number(values.formatDetails.run),
						edition: values.formatDetails.edition && Number(values.formatDetails.edition)
					};
					return formatDetails;
				}
			}
		}

		async function submitPublication(values, result) {
			if (result === true) {
				const result = await publicationCreationRequest({values: values, subType: 'isbn-ismn'});
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

		function getSteps(fieldArray, dissFieldArray) {
			const result = [];
			if (isAuthenticated) {
				fieldArray.forEach((item, i) => {
					if (i >= 4) {
						result.push(Object.keys(item));
					}
				});
				return result;
			}

			if (!isAuthenticated && publicationValues && publicationValues.type && publicationValues.type.value === 'dissertation') {
				dissFieldArray.forEach(item => result.push(Object.keys(item)));
				fieldArray.forEach((item, i) => i >= 3 && result.push(Object.keys(item)));
				return result;
			}

			if (!isAuthenticated && publicationValues && publicationValues.type && publicationValues.type.value !== 'dissertation') {
				fieldArray.forEach(item => result.push(Object.keys(item)));
				result.splice(3, 1);
				return result;
			}
		}

		function getDissertationFieldArray() {
			const dissertationFields = [
				{
					UniversityInfo: [
						{
							name: 'university[name]',
							type: 'text',
							label: 'University Name *',
							width: 'full',
							disable: publicationValues && typeof publicationValues.selectUniversity === 'object' && true
						},
						{
							name: 'university[city]',
							type: 'text',
							label: 'City *',
							width: 'full',
							disable: publicationValues && typeof publicationValues.selectUniversity === 'object' && true
						}
					]
				}
			];

			return dissertationFields;
		}

		function searchPublisherComponent() {
			const publisher = universityPublisher && universityPublisher.results.map(item => {
				return {
					title: item.name,
					place: item.city
				};
			});
			const val = publicationValues && publicationValues.university && Object.values(publicationValues.university);
			const checkDisable = val && val.some(item => item !== undefined);

			return [
				{
					name: 'selectUniversity',
					type: 'selectAutoComplete',
					label: 'Select University/Publisher',
					width: 'full',
					placeholder: 'Select University/Publisher',
					disable: checkDisable,
					options: publisher
				}
			];
		}

		function dissertCheckBox() {
			return [
				{
					name: 'insertUniversity',
					type: 'checkbox',
					label: 'Check if you do not find the university',
					width: 'half',
					info: 'You can enter university name and city which you did not find'
				}
			];
		}

		const component = (
			<>
				{typeSelect ?
					<div className={classes.typeSelect}>
						<Grid item xs={12} className="select-useType">
							<Field
								disableClearable
								freeSolo
								name="isPublic"
								placeholder="Select..."
								className={classes.selectField}
								component={renderSelectAutoComplete}
								label="Is your publication intended for public use (e.g., for library use or sale in bookshops) or will it be made otherwise available to the public? If your publication is a web-version or an ebook, will it be free to download or to buy?"
								options={[{title: 'Yes', value: true}, {title: 'No', value: false}]}
							/>
							<Typography variant="h6" className="note-txt">
								<strong>NOTE: If your publication is intended for private use only(e.g., for friends, relatives or the internal use of an association or organisation), publication will not be assigned an ISBN.</strong>
							</Typography>
						</Grid>
						<Grid item xs={12} className="select-useType">
							<Field
								disableClearable
								freeSolo
								name="type"
								placeholder="Type of publication"
								className={classes.selectField}
								component={renderSelectAutoComplete}
								label="The publication type is:"
								options={[
									{title: 'Book', value: 'book'},
									{title: 'Dissertation', value: 'dissertation'},
									{title: 'Music', value: 'music'},
									{title: 'Map', value: 'map'},
									{title: 'Other', value: 'other'}
								]}
							/>
						</Grid>
						<Button
							disabled={publicationValues && (!publicationValues.isPublic || !publicationValues.type)}
							variant="contained"
							color="primary"
							className="continue-button"
							onClick={handleContinueClick}
						>Continue
						</Button>
					</div> :
					<form className={classes.container} onSubmit={handleSubmit(handlePublicationRegistration)}>
						<Stepper alternativeLabel activeStep={activeStep} className={classes.test}>
							{steps.map(label => (
								<Step key={label}>
									<StepLabel className={classes.stepLabel}>
										{formatLabel(label)}
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
								<Button onClick={handleBack}>
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
					</form>}
			</>
		);

		return {
			...component,
			defaultProps: {
				formSyncErros: null
			},
			propTypes: {

			}
		};

		function withFormTitle({arr, publicationValues, clearFields, formName}) {
			const comp = (
				<>
					{arr.map(item => (
						<Grid key={item.title} container spacing={2} direction="row">
							<div className={classes.formHead}>
								<Typography>
									{item.title}
								</Typography>
							</div>
							{item.title === 'Author Details' ? fieldArrayElement({data: item.fields, fieldName: 'authors', clearFields, formName}) : element({array: item.fields, publicationIsbnValues: publicationValues, classes, clearFields})}
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

function mapStateToProps(state) {
	return ({
		captcha: state.common.captcha,
		user: state.login.userInfo,
		isAuthenticated: state.login.isAuthenticated,
		universityPublisher: state.publisher.universityPublisher,
		publicationValues: getFormValues('isbnIsmnRegForm')(state)
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
					label: 'Phone*',
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
				}
			]
		},
		{
			publishingActivities: [
				{
					name: 'publicationDetails[frequency][currentYear]',
					type: 'text',
					label: 'Publication Estimate this Year*',
					width: 'half'
				},
				{
					name: 'publicationDetails[frequency][nextYear]',
					type: 'text',
					label: 'Publication Estimate next Year*',
					width: 'half'
				},
				{
					name: 'publicationDetails[previouslyPublished]',
					type: 'select',
					label: 'Have you published previously?*',
					width: 'half',
					options: [
						{label: '', value: ''},
						{label: 'Yes', value: 'true'},
						{label: 'No', value: 'false'}
					]
				},
				{
					name: 'publicationDetails[publishingActivities]',
					type: 'select',
					label: 'Are your publishing activities occasional/continuous?*',
					width: 'half',
					options: [
						{label: '', value: ''},
						{label: 'Occasional', value: 'occasional'},
						{label: 'Continuous', value: 'continuous'}
					]
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
			contactInfo: [
				{
					name: 'givenName',
					type: 'text',
					label: 'First Name*',
					width: 'half'
				},
				{
					name: 'familyName',
					type: 'text',
					label: 'Last Name*',
					width: 'half'
				},
				{
					name: 'address',
					type: 'text',
					label: 'Address*',
					width: 'half'
				},
				{
					name: 'zip',
					type: 'text',
					label: 'Postcode/zip*',
					width: 'half'
				},
				{
					name: 'city',
					type: 'text',
					label: 'City*',
					width: 'half'
				},
				{
					name: 'country',
					type: 'text',
					label: 'Country*',
					width: 'half'
				},
				{
					name: 'phone',
					type: 'text',
					label: 'Telephone/Mobile',
					width: 'half'
				},
				{
					name: 'email',
					type: 'text',
					label: 'Contact email*',
					width: 'half'
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
					name: 'publicationTime',
					type: 'dateTime',
					label: 'Publication Time*',
					width: 'half'
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
							name: 'seriesDetails[seriesTitle]',
							type: 'text',
							label: 'Series title',
							width: 'half'
						},
						{
							name: 'seriesDetails[identifier]',
							type: 'text',
							label: 'Identifier',
							width: 'half'
						},
						{
							name: 'seriesDetails[volume]',
							type: 'text',
							label: 'Volume',
							width: 'half'
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
						{label: 'Both (Printed and Electronic)', value: 'both'}
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
