/* eslint-disable complexity */
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
import {FormattedMessage, useIntl} from 'react-intl';
import HttpStatus from 'http-status';

import * as actions from '../../store/actions';
import useStyles from '../../styles/form';
import ResetCaptchaButton from './ResetCaptchaButton';
import Captcha from '../Captcha';
import {element, fieldArrayElement} from './publisherRegistrationForm/commons';
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
		const intl = useIntl();
		const fieldArray = getFieldArray(intl);
		const dissFieldArray = getDissertationFieldArray(intl);
		const classes = useStyles();
		const [activeStep, setActiveStep] = useState(0);
		const [captchaInput, setCaptchaInput] = useState('');
		const [typeSelect, setTypeSelect] = useState(true);
		/* global COOKIE_NAME */
		const [cookie] = useCookies(COOKIE_NAME);

		if (publicationValues && publicationValues.type && publicationValues.type.value === 'map') {
			fieldArray[3].basicInformation.push({
				label: intl.formatMessage({id: 'publicationRegistration.form.map.scale'}),
				name: 'mapDetails[scale]',
				type: 'text',
				width: 'half'
			});
		}

		fieldArray[3].basicInformation.push({
			name: 'isbnClassification',
			type: 'multiSelect',
			width: 'half',
			label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.classification.label'}),
			isMulti: true,
			isCreatable: false,
			options: [
				{label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.classification.nonFiction'}), value: 1},
				{label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.classification.fiction'}), value: 2},
				{label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.classification.cartoon'}), value: 3},
				{label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.classification.childrenBook'}), value: 4}
			]
		});

		if (publicationValues && publicationValues.type && (publicationValues.type.value === 'dissertation' || publicationValues.type.value === 'music' || publicationValues.type.value === 'map')) {
			fieldArray[3].basicInformation.splice(4, 1);
		}

		const steps = getSteps(fieldArray, dissFieldArray);

		useEffect(() => {
			if (!isAuthenticated) {
				loadSvgCaptcha();
				getUniversityPublisher();
			}
		}, [getUniversityPublisher, isAuthenticated, loadSvgCaptcha]);

		function getStepContent(step) {
			if (isAuthenticated) {
				switch (step) {
					case 0:
						return element({array: fieldArray[3].basicInformation, classes, clearFields, publicationIsbnValues: publicationValues});
					case 1:
						return withFormTitle({arr: fieldArray[4].Authors, publicationValues, clearFields, formName: 'isbnIsmnRegForm'});
					case 2:
						return withFormTitle({arr: fieldArray[5].Series, publicationValues, clearFields});
					case 3:
						return element({array: fieldArray[6].formatDetails, fieldName: 'formatDetails', publicationIsbnValues: publicationValues, classes, clearFields, intl});
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
						return element({array: fieldArray[3].basicInformation, classes, clearFields, publicationIsbnValues: publicationValues});
					case 3:
						return withFormTitle({arr: fieldArray[4].Authors, publicationValues, clearFields, formName: 'isbnIsmnRegForm'});
					case 4:
						return withFormTitle({arr: fieldArray[5].Series, publicationValues, clearFields});
					case 5:
						return element({array: fieldArray[6].formatDetails, fieldName: 'formatDetails', publicationIsbnValues: publicationValues, classes, clearFields, intl});
					case 6:
						return renderPreview(publicationValues);
					default:
						return 'Unknown step';
				}
			}

			if (!isAuthenticated && publicationValues.type.value === 'dissertation') {
				switch (step) {
					case 0:
						return (universityPublisher.length === 0 || publicationValues.insertUniversity) ?
							<>{element({array: dissertCheckBox(), classes})}{element({array: dissFieldArray[0].UniversityInfo, classes})}</> :
							<>{element({array: searchPublisherComponent(), classes})}{element({array: dissertCheckBox(), classes})}</>;
					case 1:
						return element({array: fieldArray[2].contactInfo, classes});
					case 2:
						return element({array: fieldArray[3].basicInformation, classes, clearFields, publicationIsbnValues: publicationValues});
					case 3:
						return withFormTitle({arr: fieldArray[4].Authors, publicationValues, clearFields, formName: 'isbnIsmnRegForm'});
					case 4:
						return withFormTitle({arr: fieldArray[5].Series, publicationValues, clearFields});
					case 5:
						return element({array: fieldArray[6].formatDetails, fieldName: 'formatDetails', publicationIsbnValues: publicationValues, classes, clearFields, intl});
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
				setMessage({color: 'error', msg: intl.formatMessage({id: 'captcha.notprovided'})});
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
					email: values.email,
					phone: values.phone && values.phone,
					language: values.publisherLanguage,
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
				email,
				phone,
				publisherLanguage,
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
						fileFormat: reFormat(values.formatDetails.fileFormat)
					};
					return formatDetails;
				}

				if (values.selectFormat === 'printed') {
					const formatDetails = {
						...values.formatDetails,
						printFormat: reFormat(values.formatDetails.printFormat),
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
						fileFormat: reFormat(values.formatDetails.fileFormat),
						printFormat: reFormat(values.formatDetails.printFormat),
						run: values.formatDetails.run && Number(values.formatDetails.run),
						edition: values.formatDetails.edition && Number(values.formatDetails.edition)
					};
					return formatDetails;
				}
			}

			function reFormat(value) {
				return value.reduce((acc, item) => {
					acc.push(item.value);
					return acc;
				}, []);
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
				setMessage({color: 'error', msg: intl.formatMessage({id: 'captcha.wrong.text'})});
				loadSvgCaptcha();
			}
		}

		function renderPreview(publicationValues) {
			publicationValues = {
				...publicationValues,
				publicationTime: publicationValues.publicationTime.toLocaleString()
			};
			const formatPublicationValue = publicationValues.isbnClassification ?
				{
					...formatPublicationValues(publicationValues),
					isbnClassification: publicationValues.isbnClassification.map(item => item.label.toString())
				} : formatPublicationValues(publicationValues);
			return (
				<Grid container item xs={12}>
					<Grid item xs={12} md={6}>
						<List>
							{
								Object.keys(formatPublicationValue).map(key => {
									return (typeof formatPublicationValue[key] === 'string' || typeof formatPublicationValue[key] === 'boolean') ?
										(
											<ListComponent label={intl.formatMessage({id: `listComponent.${key}`})} value={formatPublicationValue[key]}/>
										) :
										null;
								})
							}
						</List>
					</Grid>
					<Grid item className={classes.bodyContainer} xs={12} md={6}>
						<List>
							{
								Object.keys(formatPublicationValue).map(key => {
									if (typeof formatPublicationValue[key] === 'object') {
										if (Array.isArray(formatPublicationValue[key])) {
											return <ListComponent label={intl.formatMessage({id: `listComponent.${key}`})} value={formatPublicationValue[key]}/>;
										}

										const obj = formatPublicationValue[key];
										Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : '');
										return <ListComponent label={intl.formatMessage({id: `listComponent.${key}`})} value={obj}/>;
									}

									return null;
								})
							}
						</List>
					</Grid>
				</Grid>
			);
		}

		function getSteps(fieldArray, dissFieldArray) {
			const result = [];
			if (isAuthenticated) {
				fieldArray.forEach((item, i) => {
					if (i >= 3) {
						result.push(Object.keys(item));
					}
				});
				return result;
			}

			if (!isAuthenticated && publicationValues && publicationValues.type && publicationValues.type.value === 'dissertation') {
				dissFieldArray.forEach(item => result.push(Object.keys(item)));
				fieldArray.forEach((item, i) => i >= 2 && result.push(Object.keys(item)));
				return result;
			}

			if (!isAuthenticated && publicationValues && publicationValues.type && publicationValues.type.value !== 'dissertation') {
				fieldArray.forEach(item => result.push(Object.keys(item)));
				result.splice(2, 1);
				return result;
			}
		}

		function getDissertationFieldArray(intl) {
			const dissertationFields = [
				{
					UniversityInfo: [
						{
							name: 'university[name]',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.universityInfo.universityName'}),
							width: 'full',
							disable: publicationValues && typeof publicationValues.selectUniversity === 'object' && true
						},
						{
							name: 'university[city]',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.universityInfo.city'}),
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
					label: intl.formatMessage({id: 'publicationRegistration.form.universityInfo.selectUniversity.label'}),
					width: 'full',
					placeholder: intl.formatMessage({id: 'publicationRegistration.form.universityInfo.selectUniversity.placeholder'}),
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
					label: intl.formatMessage({id: 'publicationRegistration.form.universityInfo.insertUniversity.checkbox.label'}),
					width: 'half',
					info: intl.formatMessage({id: 'publicationRegistration.form.universityInfo.insertUniversity.checkbox.info'})
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
								placeholder={intl.formatMessage({id: 'publicationRegistrationIsbnIsmn.form.note.placeholder'})}
								className={classes.selectField}
								component={renderSelectAutoComplete}
								label={<FormattedMessage id="publicationRegistrationIsbnIsmn.form.isPubic.label"/>}
								options={[
									{title: intl.formatMessage({id: 'publicationRegistrationIsbnIsmn.form.note.option.yes'}), value: true},
									{title: intl.formatMessage({id: 'publicationRegistrationIsbnIsmn.form.note.option.no'}), value: false}
								]}
							/>
							<Typography variant="h6" className="note-txt">
								<strong><FormattedMessage id="publicationRegistrationIsbnIsmn.form.note"/></strong>
							</Typography>
						</Grid>
						<Grid item xs={12} className="select-useType">
							<Field
								disableClearable
								freeSolo
								name="type"
								placeholder={intl.formatMessage({id: 'publicationRegistrationIsbnIsmn.form.type.placeholder'})}
								className={classes.selectField}
								component={renderSelectAutoComplete}
								label={<FormattedMessage id="publicationRegistrationIsbnIsmn.form.type.label"/>}
								options={[
									{title: intl.formatMessage({id: 'publicationRegistrationIsbnIsmn.form.type.option.book'}), value: 'book'},
									{title: intl.formatMessage({id: 'publicationRegistrationIsbnIsmn.form.type.option.dissertation'}), value: 'dissertation'},
									{title: intl.formatMessage({id: 'publicationRegistrationIsbnIsmn.form.type.option.music'}), value: 'music'},
									{title: intl.formatMessage({id: 'publicationRegistrationIsbnIsmn.form.type.option.map'}), value: 'map'},
									{title: intl.formatMessage({id: 'publicationRegistrationIsbnIsmn.form.type.option.other'}), value: 'other'}
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
										{intl.formatMessage({id: `publicationRegistration.stepper.label.${label}`})}
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
									<FormattedMessage id="form.button.label.back"/>
								</Button>
								{activeStep === steps.length - 1 ?
									null :
									<Button type="button" disabled={(pristine || !valid) || activeStep === steps.length - 1} variant="contained" color="primary" onClick={handleNext}>
										<FormattedMessage id="form.button.label.next"/>
									</Button>}
								{
									activeStep === steps.length - 1 &&
										<Button type="submit" disabled={pristine || !valid} variant="contained" color="primary">
											<FormattedMessage id="form.button.label.submit"/>
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

export function getFieldArray(intl) {
	const fields = [
		{
			publisherBasicInfo: [
				{
					name: 'name',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.publisherBasicInfo.name'}),
					width: 'half'
				},
				{
					name: 'postalAddress[address]',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.publisherBasicInfo.address'}),
					width: 'half'
				},
				{
					name: 'postalAddress[city]',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.publisherBasicInfo.city'}),
					width: 'half'
				},
				{
					name: 'postalAddress[zip]',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.publisherBasicInfo.zip'}),
					width: 'half'
				},
				{
					name: 'phone',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.publisherBasicInfo.phone'}),
					width: 'half'
				},
				{
					name: 'givenName',
					type: 'text',
					label: <FormattedMessage id="publicationRegistration.form.basicInformation.givenName"/>,
					width: 'half'
				},
				{
					name: 'familyName',
					type: 'text',
					label: <FormattedMessage id="publicationRegistration.form.basicInformation.familyName"/>,
					width: 'half'
				},
				{
					name: 'email',
					type: 'text',
					label: <FormattedMessage id="publicationRegistration.form.basicInformation.email"/>,
					width: 'half'
				},
				{
					name: 'publisherLanguage',
					type: 'select',
					label: intl.formatMessage({id: 'publicationRegistration.form.publisherBasicInfo.selectLanguage.label'}),
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
					label: intl.formatMessage({id: 'publicationRegistration.form.publishingActivities.thisYear'}),
					width: 'half'
				},
				{
					name: 'publicationDetails[frequency][nextYear]',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.publishingActivities.nextYear'}),
					width: 'half'
				},
				{
					name: 'publicationDetails[previouslyPublished]',
					type: 'select',
					label: intl.formatMessage({id: 'publicationRegistration.form.publishingActivities.previouslyPublished'}),
					width: 'half',
					options: [
						{label: '', value: ''},
						{label: intl.formatMessage({id: 'publicationRegistration.form.publishingActivities.previouslyPublished.yes'}), value: 'true'},
						{label: intl.formatMessage({id: 'publicationRegistration.form.publishingActivities.previouslyPublished.no'}), value: 'false'}
					]
				},
				{
					name: 'publicationDetails[publishingActivities]',
					type: 'select',
					label: intl.formatMessage({id: 'publicationRegistration.form.publishingActivities.occasionalOrContinuous'}),
					width: 'half',
					options: [
						{label: '', value: ''},
						{label: intl.formatMessage({id: 'publicationRegistration.form.publishingActivities.occasional'}), value: 'occasional'},
						{label: intl.formatMessage({id: 'publicationRegistration.form.publishingActivities.continuous'}), value: 'continuous'}
					]
				}
			]
		},
		{
			contactInfo: [
				{
					name: 'givenName',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.contactInfo.givenName'}),
					width: 'half'
				},
				{
					name: 'familyName',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.contactInfo.familyName'}),
					width: 'half'
				},
				{
					name: 'address',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.contactInfo.address'}),
					width: 'half'
				},
				{
					name: 'zip',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.contactInfo.zip'}),
					width: 'half'
				},
				{
					name: 'city',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.contactInfo.city'}),
					width: 'half'
				},
				{
					name: 'country',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.contactInfo.country'}),
					width: 'half'
				},
				{
					name: 'phone',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.contactInfo.phone'}),
					width: 'half'
				},
				{
					name: 'email',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.contactInfo.email'}),
					width: 'half'
				}
			]
		},
		{
			basicInformation: [
				{
					name: 'title',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.title'}),
					width: 'half'
				},
				{
					name: 'subtitle',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.subtitle'}),
					width: 'half'
				},
				{
					name: 'language',
					type: 'select',
					label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.language.title'}),
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
					views: ['year', 'month'],
					format: 'MM/yyyy',
					label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.publicationTime'}),
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
							label: intl.formatMessage({id: 'publicationRegistration.form.authors.authorGivenName'}),
							width: 'half'
						},
						{
							name: 'authorFamilyName',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.authors.authorFamilyName'}),
							width: 'half'
						},
						{
							name: 'role',
							type: 'select',
							label: intl.formatMessage({id: 'publicationRegistration.form.authors.role'}),
							width: 'half',
							options: [
								{label: '', value: ''},
								{label: intl.formatMessage({id: 'publicationRegistration.form.authors.role.author'}), value: 'author'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.authors.role.illustrator'}), value: 'illustrator'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.authors.role.translator'}), value: 'translator'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.authors.role.editor'}), value: 'editor'}
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
							label: intl.formatMessage({id: 'publicationRegistration.form.series.title'}),
							width: 'half'
						},
						{
							name: 'seriesDetails[identifier]',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.series.identifier'}),
							width: 'half'
						},
						{
							name: 'seriesDetails[volume]',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.series.volume'}),
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
						{label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed'}), value: 'printed'},
						{label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.electronic'}), value: 'electronic'},
						{label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.both'}), value: 'both'}
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
