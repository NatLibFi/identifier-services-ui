/* eslint-disable no-unused-expressions */
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
import React from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray, reduxForm, isPristine} from 'redux-form';
import {Button, Grid, Stepper, Step, StepButton} from '@material-ui/core';
import PropTypes from 'prop-types';
// Import {validate} from '@natlibfi/identifier-services-commons';

import renderTextField from './render/renderTextField';
import RenderChipsField from './render/renderChipsField';
import useStyles from '../../styles/form';
import {registerPublisher} from '../../store/actions/publisherRegistration';

const fieldArray = [
	{
		basicInformation: [
			{
				name: 'name',
				type: 'text',
				label: 'Name',
				width: 'half'
			},
			{
				name: 'publisherEmail',
				type: 'email',
				label: 'Publisher Email',
				width: 'half'
			},
			{
				name: 'publicationEstimate',
				type: 'number',
				label: 'Publication Estimate',
				width: 'half'
			},
			{
				name: 'website',
				type: 'text',
				label: 'Website',
				width: 'half'
			},
			{
				name: 'aliases',
				type: 'chips',
				label: 'Aliases',
				width: 'full'
			}
		]
	},
	{
		contactDetails: [
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
				label: 'Email',
				width: 'full'
			}

		]
	},
	{
		address: [
			{
				name: 'streetAddress',
				type: 'text',
				label: 'Street Address',
				width: 'full'
			},
			{
				name: 'city',
				type: 'text',
				label: 'City',
				width: 'full'
			},
			{
				name: 'zip',
				type: 'number',
				label: 'Zip',
				width: 'full'
			}

		]
	}
];

function getSteps() {
	return fieldArray.map(item => Object.keys(item));
}

const PublisherRegistrationForm = props => {
	const {handleSubmit, pristine, valid, registerPublisher} = props;
	console.log('----', props)
	const classes = useStyles();
	const [activeStep, setActiveStep] = React.useState(0);
	const steps = getSteps();

	function getStepContent(step) {
		switch (step) {
			case 0:
				return element(fieldArray[0].basicInformation, classes);
			case 1:
				return fieldArrayElement(fieldArray[1].contactDetails, classes);
			case 2:
				return element(fieldArray[2].address, classes);
			default:
				return 'Unknown step';
		}
	}

	function handleNext() {
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	}

	function handleBack() {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	}

	const handlePublisherRegistration = values => {
		const newPublisher = {
			...values
		};
		registerPublisher(newPublisher);
	};

	return (
		<form className={classes.container} onSubmit={handleSubmit(handlePublisherRegistration)}>
			<Stepper alternativeLabel activeStep={activeStep}>
				{steps.map(label => (
					<Step key={label}>
						<StepButton className={classes.stepLabel}>
							{label}
						</StepButton>
					</Step>
				))}
			</Stepper>
			<div className={classes.subContainer}>
				<Grid container spacing={3} direction="row">
					{(getStepContent(activeStep))}
				</Grid>
				<div className={classes.btnContainer}>
					<Button disabled={activeStep === 0} onClick={handleBack}>
						Back
					</Button>
					{
						activeStep === steps.length - 1 ?
							<Button type="submit" disabled={pristine || !valid} variant="contained" color="primary">
						Submit
							</Button> :
							<Button type="button" disabled={pristine || !valid} variant="contained" color="primary" onClick={handleNext}>
						Next
							</Button>
					}
				</div>
			</div>
		</form>
	);
};

const mapStateToProps = state => ({
	pristine: isPristine('publisherRegistrationForm')(state)
	// FormSyncErrors: getFormSyncErrors('publisherRegistrationForm')(state)
});

PublisherRegistrationForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	pristine: PropTypes.bool.isRequired,
	formSyncErrors: PropTypes.shape({}),
	registerPublisher: PropTypes.func.isRequired
};

PublisherRegistrationForm.defaultProps = {
	formSyncErrors: null
};

function element(array, classes, field) {
	return array.map(list =>
		// eslint-disable-next-line no-negated-condition
		((list.width !== 'full') ?
			<Grid key={list.name} item xs={6}>
				<Field
					className={`${classes.textField} ${list.width}`}
					component={renderTextField}
					label={list.label}
					name={field ? `${field}.${list.name}` : list.name}
					type={list.type}
				/>
			</Grid> :
			((list.type === 'chips') ?
				<Grid key={list.name} item xs={12}>
					<FieldArray
						component={RenderChipsField}
						className={`${classes.chipField} ${list.width}`}
						label={list.label}
						name={list.name}
						type={list.type}
					/>
				</Grid> :
				<Grid key={list.name} item xs={12}>
					<Field
						className={`${classes.textField} ${list.width}`}
						component={renderTextField}
						label={list.label}
						name={list.name}
						type={list.type}
					/>
				</Grid>))
	);
}

function fieldArrayElement(array, classes) {
	return (
		<FieldArray
			component={renderFieldArray}
			className={`${classes.chipField} full`}
			name="contactDetails"
		/>
	);

	function renderFieldArray({fields, meta}) {
		fields.getAll() === undefined && fields.push({});
		return (
			<>
				{fields.map(field => array.map(list =>
					(
						<Grid key={list.name} item xs={12}>
							<Field
								className={`${classes.textField} ${list.width}`}
								component={renderTextField}
								label={list.label}
								name={field ? `${field}.${list.name}` : list.name}
								type={list.type}
							/>
						</Grid>
					)))}
				<Button onClick={() => fields.push({})}>Plus</Button>
			</>

		);
	}
}

export default connect(mapStateToProps, {registerPublisher})(reduxForm({form: 'publisherRegistrationForm', validate, touchOnChange: true, destroyOnUnmount: true})(PublisherRegistrationForm));

export function validate(values) {
	const errors = {};

	if (!values.name) {
		errors.name = 'Name is Required!!';
	} else if (values.length < 2 && values.length > 20) {
		errors.name = 'Name length must be between 2-20';
	} else if (/[0-9]/i.test(values.name)) {
		errors.name = 'Name should not have numbers';
	}

	if (!values.givenName) {
		errors.givenName = 'Given Name is Required!!';
	} else if (values.length < 2 && values.length > 20) {
		errors.givenName = 'Given Name length must be between 2-20';
	} else if (/[0-9]/i.test(values.givenName)) {
		errors.givenName = 'Given Name should not have numbers';
	}

	if (!values.familyName) {
		errors.familyName = 'Family Name is Required!!';
	} else if (values.length < 2 && values.length > 20) {
		errors.familyName = 'Family Name length must be between 2-20';
	} else if (/[0-9]/i.test(values.familyName)) {
		errors.familyName = 'Family Name should not have numbers';
	}

	if (!values.email) {
		errors.email = 'Email is Required!!!';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = 'Invalid e-mail address';
	}

	if (!values.publisherEmail) {
		errors.publisherEmail = 'Publisher\'s Email is required';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.publisherEmail)) {
		errors.publisherEmail = 'Invalid e-mail address';
	}

	if (!values.publicationEstimate) {
		errors.publicationEstimate = 'This Field cannot be left empty!!';
	} else if (!/[0-9]/i.test(values.publicationEstimate)) {
		errors.publicationEstimate = 'Numbers only!!!';
	}

	if (!values.website) {
		errors.website = 'The Field cannot be left empty';
	}

	if (!values.aliases) {
		errors.aliases = 'Aliases cannot be empty';
	}

	if (!values.streetAddress) {
		errors.streetAddress = 'Street Address cannot be empty.';
	} else if (values.streetAddress.length < 2) {
		errors.streetAddress = 'Value must be between more than 2 characters';
	}

	if (!values.city) {
		errors.city = 'Please specify a city';
	} else if (values.city.length < 2) {
		errors.city = 'Value must be between more than 2 characters';
	}

	if (!values.zip) {
		errors.zip = 'Zip code cannot be empty';
	} else if (!/[0-9]/i.test(values.zip)) {
		errors.zip = 'Value must be numbers';
	}

	return errors;
}
