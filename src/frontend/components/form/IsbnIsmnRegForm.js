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
import {Button, Grid, Stepper, Step, StepLabel, Typography, List, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core';
import {connect} from 'react-redux';
import {useCookies} from 'react-cookie';
import HttpStatus from 'http-status';

import * as actions from '../../store/actions';
import ResetCaptchaButton from './RangeCreationForm';
import useStyles from '../../styles/form';
import Captcha from '../Captcha';
import {element, fieldArrayElement, formatAddress, formatLabel} from './publisherRegistrationForm/commons';
import {classificationCodes} from './publisherRegistrationForm/formFieldVariable';
import ListComponent from '../ListComponent';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'isbnIsmnRegForm',
	initialValues: {
		language: 'eng',
		publisherLanguage: 'eng',
		isPublic: false,
		insertUniversity: false,
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
		const [affiliateOf, setAffiliateOf] = useState(false);
		const [affiliates, setAffiliates] = useState(false);
		const [distributor, setDistributor] = useState(false);
		const [distributorOf, setDistributorOf] = useState(false);
		const [pubType, setPubType] = useState(null);
		const [typeSelect, setTypeSelect] = useState(true);
		/* global COOKIE_NAME */
		const [cookie] = useCookies(COOKIE_NAME);

		if (pubType === 'map') {
			fieldArray[5].basicInformation.push({
				label: 'Scale',
				name: 'mapDetails[scale]',
				type: 'text',
				width: 'half'
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
						return element({array: fieldArray[5].basicInformation, classes, clearFields, publicationIsbnValues: publicationValues, isbnPubType: pubType});
					case 1:
						return withFormTitle({arr: fieldArray[6].Authors, publicationValues, clearFields, formName: 'isbnIsmnRegForm'});
					case 2:
						return withFormTitle({arr: fieldArray[7].Series, publicationValues, clearFields});
					case 3:
						return element({array: fieldArray[8].formatDetails, fieldName: 'formatDetails', publicationIsbnValues: publicationValues, classes, clearFields});
					case 4:
						return renderPreview(publicationValues);
					default:
						return 'Unknown step';
				}
			}

			if (!isAuthenticated && pubType !== 'dissertation') {
				switch (step) {
					case 0:
						return element({array: fieldArray[0].publisherBasicInfo, classes, clearFields});
					case 1:
						return element({array: fieldArray[1].publishingActivities, classes, clearFields});
					case 2:
						return fieldArrayElement({data: fieldArray[2].primaryContact, fieldName: 'primaryContact', clearFields});
					case 3:
						return orgDetail1({arr: fieldArray[3].organization, classes, fieldName: 'affiliates', clearFields});
					case 4:
						return orgDetail2({arr: fieldArray[4].organization, classes});
					case 5:
						return element({array: fieldArray[5].basicInformation, classes, clearFields, publicationIsbnValues: publicationValues, isbnPubType: pubType});
					case 6:
						return withFormTitle({arr: fieldArray[6].Authors, publicationValues, clearFields, formName: 'isbnIsmnRegForm'});
					case 7:
						return withFormTitle({arr: fieldArray[7].Series, publicationValues, clearFields});
					case 8:
						return element({array: fieldArray[8].formatDetails, fieldName: 'formatDetails', publicationIsbnValues: publicationValues, classes, clearFields});
					case 9:
						return renderPreview(publicationValues);
					default:
						return 'Unknown step';
				}
			}

			if (!isAuthenticated && pubType === 'dissertation') {
				switch (step) {
					case 0:
						return publicationValues.insertUniversity ?
							<>{element({array: searchPublisherComponent(), classes})}{element({array: dissFieldArray[0].UniversityInfo, classes})}</> :
							element({array: searchPublisherComponent(), classes});
					case 1:
						return element({array: fieldArray[5].basicInformation, classes, clearFields, publicationIsbnValues: publicationValues, isbnPubType: pubType});
					case 2:
						return withFormTitle({arr: fieldArray[6].Authors, publicationValues, clearFields, formName: 'isbnIsmnRegForm'});
					case 3:
						return withFormTitle({arr: fieldArray[7].Series, publicationValues, clearFields});
					case 4:
						return element({array: fieldArray[8].formatDetails, fieldName: 'formatDetails', publicationIsbnValues: publicationValues, classes, clearFields});
					case 5:
						return renderPreview(publicationValues);
					default:
						return 'Unknown step';
				}
			}
		}

		const handleTypeChange = e => {
			setPubType(e.target.value);
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
			const dissertPublisher = !isAuthenticated && (pubType === 'dissertation' ?
				(values.university && values.university.id) || {university: values.universityName, city: values.universityCity} :
				{
					name: values.name,
					postalAddress: values.postalAddress,
					publisherEmail: values.publisherEmail,
					phone: values.phone && values.phone,
					website: values.website && values.website,
					language: values.publisherLanguage,
					aliases: values.aliases && values.aliases,
					primaryContact: values.primaryContact,
					code: values.code && values.code,
					classification: values.classification.map(item => item.value.toString()),
					publisherType: values.publisherType,
					organizationDetails: {
						affiliateOf: values.affiliateOf && formatAddress(values.affiliateOf),
						affiliates: values.affiliates && values.affiliates.map(item => formatAddress(item)),
						distributorOf: values.distributorOf && formatAddress(values.distributorOf),
						distributor: values.distributor && formatAddress(values.distributor)
					},
					publicationDetails: {frequency: Number(Object.values(values.publicationDetails))
					}
				});
			const publisher = isAuthenticated ? user.publisher : dissertPublisher;

			const formatAuthors = values.authors.map(item => Object.keys(item).reduce((acc, key) => {
				return {...acc, [replaceKey(key)]: item[key]};
			}, {}));

			function formatTitle() {
				const {seriesTitle, ...formatTitle} = values.seriesDetails && {
					...values.seriesDetails,
					volume: values.seriesDetails.volume && Number(values.seriesDetails.volume),
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
				website,
				publisherLanguage,
				aliases,
				primaryContact,
				code,
				classification,
				publisherType,
				affiliateOf,
				affiliates,
				distributorOf,
				distributor,
				publicationDetails,
				insertUniversity,
				university,
				universityName,
				universityCity,
				...formattedPublicationValue
			} = {
				...values,
				publisher,
				authors: formatAuthors,
				seriesDetails: values.seriesDetails && formatTitle(),
				formatDetails: formatDetail(),
				type: pubType,
				isbnClassification: values.isbnClassification ? values.isbnClassification.map(item => item.value.toString()) : undefined,
				mapDetails: pubType === 'map' ? map : undefined
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
					if (i >= 5) {
						result.push(Object.keys(item));
					}
				});
				return result;
			}

			if (!isAuthenticated && pubType === 'dissertation') {
				dissFieldArray.forEach(item => result.push(Object.keys(item)));
				fieldArray.forEach((item, i) => i >= 5 && result.push(Object.keys(item)));
				return result;
			}

			return fieldArray.map(item => Object.keys(item));
		}

		function getDissertationFieldArray() {
			const dissertationFields = [
				{
					UniversityInfo: [
						{
							name: 'universityName',
							type: 'text',
							label: 'University Name *',
							width: 'full',
							disable: publicationValues && typeof publicationValues.university === 'object' && true
						},
						{
							name: 'universityCity',
							type: 'text',
							label: 'City *',
							width: 'full',
							disable: publicationValues && typeof publicationValues.university === 'object' && true
						}
					]
				}
			];

			return dissertationFields;
		}

		function searchPublisherComponent() {
			const publisher = universityPublisher && universityPublisher.results.map(item => {
				return {
					id: item.id,
					title: item.name
				};
			});
			return [
				{
					name: 'university',
					type: 'selectAutoComplete',
					label: 'Select University/Publisher',
					width: 'full',
					placeholder: 'Select University/Publisher',
					showCheckbox: true,
					options: publisher
				}
			];
		}

		const component = (
			<>
				{typeSelect ?
					<div className={classes.typeSelect}>
						<FormControl className={classes.pubSelect}>
							<InputLabel id="type-selection">The publication type is:</InputLabel>
							<Select
								labelId="type-selection"
								value={pubType}
								onChange={handleTypeChange}
							>
								<MenuItem value="book">Book</MenuItem>
								<MenuItem value="dissertation">Dissertation</MenuItem>
								<MenuItem value="music">Music</MenuItem>
								<MenuItem value="map">Map</MenuItem>
								<MenuItem value="other">Other</MenuItem>
							</Select>
						</FormControl>
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

		function orgDetail1({arr, classes, fieldName, clearFields}) {
			const comp = (
				<>
					<Button variant={affiliateOf ? 'contained' : 'outlined'} color="primary" onClick={() => setAffiliateOf(!affiliateOf)}>Add {arr[0].title}</Button>&nbsp;
					<Button variant={affiliates ? 'contained' : 'outlined'} color="primary" onClick={() => setAffiliates(!affiliates)}>Add {arr[1].title}</Button>
					{affiliateOf ? organizationalForm({fieldItem: arr[0], classes, fieldName, clearFields}) : null}
					{affiliates ? organizationalForm({fieldItem: arr[1], classes, fieldName, clearFields}) : null}
				</>
			);

			return {
				...comp
			};
		}

		function orgDetail2({arr, classes, fieldName, clearFields}) {
			const comp = (
				<>
					<Button variant={distributorOf ? 'contained' : 'outlined'} color="primary" onClick={() => setDistributorOf(!distributorOf)}>Add {arr[0].title}</Button>&nbsp;
					<Button variant={distributor ? 'contained' : 'outlined'} color="primary" onClick={() => setDistributor(!distributor)}>Add {arr[1].title}</Button>
					{distributorOf ? organizationalForm({fieldItem: arr[0], classes, fieldName, clearFields}) : null}
					{distributor ? organizationalForm({fieldItem: arr[1], classes, fieldName, clearFields}) : null}
				</>
			);

			return {
				...comp
			};
		}

		function organizationalForm({fieldItem, classes, fieldName, clearFields}) {
			const comp = (
				<>
					<div className={classes.formHead}>
						<Typography variant="h6">
							{fieldItem.title}
						</Typography>
					</div>
					{fieldItem.title === 'Affiliates' ? fieldArrayElement({data: fieldItem.fields, fieldName, clearFields}) : element({array: fieldItem.fields, classes, clearFields})}

				</>
			);

			return {
				...comp
			};
		}

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
					name: 'website',
					type: 'text',
					label: 'Website',
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
					name: 'publisherType',
					type: 'select',
					label: 'Select Type of Publisher *',
					width: 'half',
					options: [
						{label: '', value: ''},
						{label: 'University', value: 'university'},
						{label: 'Other', value: 'other'}
					]
				},
				{
					name: 'postalAddress[public]',
					type: 'checkbox',
					label: 'Public',
					width: 'half',
					info: 'Check to make your postal address available to public.'
				}
			]
		},
		{
			publishingActivities: [
				{
					name: 'publicationDetails[frequency]',
					type: 'text',
					label: 'Publication Estimate*',
					width: 'half'
				},
				{
					name: 'aliases',
					type: 'arrayString',
					label: 'Aliases',
					width: 'full',
					subName: 'alias'
				},
				{
					name: 'classification',
					type: 'multiSelect',
					label: 'Classification*',
					options: classificationCodes,
					width: 'full',
					isMulti: true
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
			organization: [
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
			organization: [
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
				},
				{
					name: 'isPublic',
					type: 'checkbox',
					label: 'Is Public',
					width: 'full',
					info: `Check the box if your publication intended for public use (e.g., for library use or sale in bookshops) or available to the public.
							If it is for private use only, publication will not be assigned an ISBN `
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
							type: 'number',
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
