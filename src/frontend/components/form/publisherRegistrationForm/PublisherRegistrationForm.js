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
import {reduxForm, getFormValues} from 'redux-form';
import {Button, Grid, Stepper, Step, StepLabel, Typography, List, ListItem} from '@material-ui/core';
import PropTypes from 'prop-types';
import {validate} from '@natlibfi/identifier-services-commons';
import HttpStatus from 'http-status';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import useStyles from '../../../styles/form';
import ListComponent from '../../ListComponent';
import Captcha from '../../Captcha';
import {fieldArray} from './formFieldVariable';
import notes from './notes';
import * as actions from '../../../store/actions';
import {element, fieldArrayElement, formatAddress, formatLabel} from './commons';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publisherRegistrationForm',
	initialValues: {
		language: 'eng',
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
			isAuthenticated,
			handleClose,
			setMessage,
			setIsCreating,
			reset
		} = props;
		const classes = useStyles();
		const [activeStep, setActiveStep] = useState(0);
		const [captchaInput, setCaptchaInput] = useState('');
		const [affiliateOf, setAffiliateOf] = useState(false);
		const [affiliates, setAffiliates] = useState(false);
		const [distributor, setDistributor] = useState(false);
		const [distributorOf, setDistributorOf] = useState(false);
		useEffect(() => {
			if (!isAuthenticated) {
				loadSvgCaptcha();
			}

			if (publicationRegistration) {
				setPublisherRegForm(false);
			}

		// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [isAuthenticated, loadSvgCaptcha]);

		const steps = getSteps();
		function getStepContent(step) {
			switch (step) {
				case 0:
					return element({array: fieldArray[0].basicInformation, classes, clearFields});
				case 1:
					return element({array: fieldArray[1].publishingActivities, classes, clearFields});
				case 2:
					return fieldArrayElement({data: fieldArray[2].primaryContact, fieldName: 'primaryContact', clearFields});
				case 3:
					return orgDetail1({arr: fieldArray[3].organization, classes, fieldName: 'affiliates', clearFields});
				case 4:
					return orgDetail2({arr: fieldArray[4].organization, classes});
				case 5:
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
			if (isAuthenticated) {
				publisherCreationRequest(formatPublisher(values));
				setIsCreating(true);
				handleClose();
				reset();
			} else if (captchaInput.length === 0) {
				setMessage({color: 'error', msg: 'Captcha not provided'});
			} else if (captchaInput.length > 0) {
				const result = await postCaptchaInput(captchaInput, captcha.id);
				await makeNewPublisherObj(values, result);
			}
		};

		function handleFormatPublisher() {
			handleSetPublisher(formatPublisher(publisherValues));
		}

		async function makeNewPublisherObj(values, result) {
			const newPublisher = formatPublisher(values);
			if (result === true) {
				const result = await publisherCreationRequest(newPublisher);
				if (result === HttpStatus.CREATED) {
					handleClose();
					reset();
				}
			} else {
				setMessage({color: 'error', msg: 'Please type the correct word in the image below'});
				loadSvgCaptcha();
			}
		}

		function formatPublisher(values) {
			const newClassification = values.classification.map(item => item.value.toString());
			const organizationDetails = {
				affiliateOf: values.affiliateOf && formatAddress(values.affiliateOf),
				affiliates: values.affiliates && values.affiliates.map(item => formatAddress(item)),
				distributorOf: values.distributorOf && formatAddress(values.distributorOf),
				distributor: values.distributor && formatAddress(values.distributor)
			};
			const publicationDetails = values.publicationDetails;
			const {affiliateOf, affiliates, distributorOf, distributor, ...rest} = {...values};

			const newPublisher = {
				...rest,
				organizationDetails: organizationDetails && organizationDetails,
				classification: newClassification,
				publicationDetails: {...publicationDetails, frequency: Number(Object.values(publicationDetails))}
			};
			return newPublisher;
		}

		const component = (
			<form className={classes.container} onSubmit={handleSubmit(handlePublisherRegistration)}>
				<Stepper alternativeLabel className={publicationRegistration ? classes.smallStepper : null} activeStep={activeStep}>
					{steps.map(label => (
						<Step key={label}>
							<StepLabel className={publicationRegistration ? classes.smallFontStepLabel : classes.stepLabel}>
								{formatLabel(label)}
							</StepLabel>
						</Step>
					))}
				</Stepper>
				<div className={classes.subContainer}>
					{activeStep === 0 && renderNotes()}
					<Grid container spacing={2} direction="row">
						{(getStepContent(activeStep))}

						{(!publicationRegistration &&
							activeStep === steps.length - 1) &&
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
								</Grid>}
					</Grid>
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
			</form>
		);

		function getSteps() {
			return fieldArray.map(item => Object.keys(item));
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
										<ListComponent label={key} value={key === 'classification' ?
											publisherValues[key].map(item => (item.value).toString()) : publisherValues[key]}/> :
										null;
								})
							}
						</List>
					</Grid>
				</>
			);
		}

		function renderNotes() {
			return (
				<div className={classes.notesContainer}>
					<Typography className={classes.notes}>When joining the ISBN system, the publisher commits itself to the following obligations:</Typography>
					<List>
						{notes.map(item => (
							<ListItem key={item} className={classes.notesList}>
								<ArrowRightAltIcon/>
								<Typography className={classes.notes}>{item}</Typography>
							</ListItem>
						))}
					</List>
				</div>
			);
		}

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

function mapStateToProps(state) {
	return ({
		captcha: state.common.captcha,
		isAuthenticated: state.login.isAuthenticated,
		publisherValues: getFormValues('publisherRegistrationForm')(state)
	});
}

