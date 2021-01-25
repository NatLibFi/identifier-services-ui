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
import {useIntl, FormattedMessage} from 'react-intl';

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
		const intl = useIntl();
		const fieldArray = getFieldArray(intl);
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

		function getStepContent(step) {
			if (isAuthenticated) {
				switch (step) {
					case 0:
						return publisherElement({array: fieldArray[1].basicInformation, classes, clearFields});
					case 1:
						return withFormTitle({arr: fieldArray[2].Time, publicationValues, clearFields});
					case 2:
						return withFormTitle({arr: fieldArray[3].PreviousPublication, publicationValues, clearFields});
					case 3:
						return withFormTitle({arr: fieldArray[4].SeriesDetails, publicationValues, clearFields});
					case 4:
						return publisherElement({array: fieldArray[5].formatDetails, fieldName: 'formatDetails', publicationIssnValues: publicationValues, classes, clearFields, intl});
					case 5:
						return renderPreview(publicationValues);
					default:
						return 'Unknown step';
				}
			}

			if (!isAuthenticated) {
				switch (step) {
					case 0:
						return publisherElement({array: fieldArray[0].publisherBasicInfo, classes, clearFields});
					case 1:
						return publisherElement({array: fieldArray[1].basicInformation, classes, clearFields});
					case 2:
						return withFormTitle({arr: fieldArray[2].Time, publicationValues, clearFields});
					case 3:
						return withFormTitle({arr: fieldArray[3].PreviousPublication, publicationValues, clearFields});
					case 4:
						return withFormTitle({arr: fieldArray[4].SeriesDetails, publicationValues, clearFields});
					case 5:
						return publisherElement({array: fieldArray[5].formatDetails, fieldName: 'formatDetails', publicationIssnValues: publicationValues, classes, clearFields, intl});
					case 6:
						return renderPreview(publicationValues);
					default:
						return 'Unknown step';
				}
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
				setMessage({color: 'error', msg: intl.formatMessage({id: 'captcha.notprovided'})});
			} else if (captchaInput.length > 0) {
				const result = await postCaptchaInput(captchaInput, captcha.id);
				submitPublication(formatPublicationValues(values), result);
			}
		}

		function formatPublicationValues(values) {
			const publisher = isAuthenticated ? user.publisher : {
				name: values.name,
				postalAddress: values.postalAddress,
				publisherEmail: values.email,
				phone: values.phone,
				language: values.publisherLanguage,
				aliases: values.aliases && values.aliases
			};
			const {name, postalAddress, publisherEmail, phone, publisherLanguage, ...formattedPublicationValues} = {
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
				formatDetails: formatDetail(),
				type: values.type.value
			};
			return formattedPublicationValues;

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
				const result = await publicationCreationRequest({values: values, subType: 'issn'});
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
			const values = formatPublicationValues(publicationValues);
			const {seriesDetails, ...formatValues} = {
				...values,
				mainSeries: values.seriesDetails && values.seriesDetails.mainSeries,
				subSeries: values.seriesDetails && values.seriesDetails.subSeries
			};
			return (
				<Grid container item className={classes.bodyContainer} xs={12}>
					<Grid item xs={12} md={6}>
						<List>
							{
								Object.keys(formatValues).map(key => {
									return (typeof formatValues[key] === 'string') ?
										(
											<ListComponent label={intl.formatMessage({id: `listComponent.${key}`})} value={formatValues[key]}/>
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
									if (typeof formatValues[key] === 'object') {
										if (Array.isArray(formatValues[key])) {
											return <ListComponent label={intl.formatMessage({id: `listComponent.${key}`})} value={formatValues[key]}/>;
										}

										const obj = formatValues[key];
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

		const component = (
			<form className={classes.container} onSubmit={handleSubmit(handlePublicationRegistration)}>
				<Stepper alternativeLabel activeStep={activeStep}>
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
						<Button disabled={activeStep === 0} onClick={handleBack}>
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

		function getSteps(fieldArray) {
			const result = [];
			if (isAuthenticated) {
				fieldArray.forEach((item, i) => {
					if (i >= 1) {
						result.push(Object.keys(item));
					}
				});
				return result;
			}

			return fieldArray.map(item => Object.keys(item));
		}
	}
));

function mapStateToProps(state) {
	return ({
		captcha: state.common.captcha,
		user: state.login.userInfo,
		isAuthenticated: state.login.isAuthenticated,
		publicationValues: getFormValues('issnRegForm')(state)
	});
}

function getFieldArray(intl) {
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
					label: <FormattedMessage id="publisherRegistration.form.basicInformation.givenName"/>,
					width: 'half'
				},
				{
					name: 'familyName',
					type: 'text',
					label: <FormattedMessage id="publisherRegistration.form.basicInformation.familyName"/>,
					width: 'half'
				},
				{
					name: 'email',
					type: 'text',
					label: <FormattedMessage id="publisherRegistration.form.basicInformation.email"/>,
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
					name: 'additionalDetails',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.additionalDetails'}),
					width: 'half'
				},
				{
					name: 'manufacturer',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.manufacturer'}),
					width: 'half'
				},
				{
					name: 'city',
					type: 'text',
					label: intl.formatMessage({id: 'publicationRegistration.form.basicInformation.city'}),
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
							label: intl.formatMessage({id: 'publicationRegistration.form.Time.firstYear'}),
							width: 'half'
						},
						{
							name: 'firstNumber',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.Time.firstNumber'}),
							width: 'half'
						},
						{
							name: 'frequency',
							type: 'multiSelect',
							width: 'half',
							label: intl.formatMessage({id: 'publicationRegistration.form.Time.frequency'}),
							options: [
								{label: '', value: ''},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.frequency.yearly'}), value: 'yearly'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.frequency.monthly'}), value: 'monthly'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.frequency.weekly'}), value: 'weekly'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.frequency.daily'}), value: 'daily'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.frequency.biyearly'}), value: 'bi-yearly'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.frequency.quarterly'}), value: 'quarterly'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.frequency.bimonthly'}), value: 'bi-monthly'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.frequency.continuously'}), value: 'continuously'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.frequency.irregular'}), value: 'irregular'}

							]
						},
						{
							name: 'type',
							type: 'multiSelect',
							width: 'half',
							label: intl.formatMessage({id: 'publicationRegistration.form.Time.type'}),
							options: [
								{label: '', value: ''},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.type.journal'}), value: 'journal'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.type.newsletter'}), value: 'newsletter'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.type.staffmagazine'}), value: 'staff-magazine'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.type.membershipmagazine'}), value: 'membership-magazine'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.type.cartoon'}), value: 'cartoon'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.type.newspaper'}), value: 'newspaper'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.type.freepaper'}), value: 'free-paper'},
								{label: intl.formatMessage({id: 'publicationRegistration.form.Time.type.monography'}), value: 'monography'}

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
							label: intl.formatMessage({id: 'publicationRegistration.form.PreviousPublication.lastYear'}),
							width: 'full'
						},
						{
							name: 'previousPublication[lastNumber]',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.PreviousPublication.lastNumber'}),
							width: 'full'
						},
						{
							name: 'previousPublication[title]',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.PreviousPublication.title'}),
							width: 'half'
						},
						{
							name: 'previousPublication[identifier]',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.PreviousPublication.identifier'}),
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
							label: intl.formatMessage({id: 'publicationRegistration.form.PreviousPublication.title'}),
							width: 'half'
						},
						{
							name: 'otherMedium[identifier]',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.PreviousPublication.identifier'}),
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
							label: intl.formatMessage({id: 'publicationRegistration.form.seriesDetails.title'}),
							width: 'half'
						},
						{
							name: 'seriesDetails[mainSeries[identifier]]',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.seriesDetails.identifier'}),
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
							label: intl.formatMessage({id: 'publicationRegistration.form.seriesDetails.title'}),
							width: 'half'
						},
						{
							name: 'seriesDetails[subSeries[identifier]]',
							type: 'text',
							label: intl.formatMessage({id: 'publicationRegistration.form.seriesDetails.identifier'}),
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
