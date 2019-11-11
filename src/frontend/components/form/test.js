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
import React, {useState} from 'react';
import {Field, reduxForm} from 'redux-form';
import {Button, FormGroup} from '@material-ui/core';
import {PropTypes} from 'prop-types';
import renderTextField from './render/renderTextField';
import renderRadioButton from './render/renderRadioButton';
import renderSelect from './render/renderSelect';
import renderPickers from './render/renderPickers';

const ContactForm = ({handleSubmit}) => {
	const initialState = {};
	const [state, setState] = useState(initialState);

	const handleClick = values => {
		setState({...state, values});
	};

	const genderOption = [
		{label: 'male', value: 'male'},
		{label: 'female', value: 'female'}
	];

	return (
		<form onSubmit={handleSubmit(handleClick)}>
			<FormGroup>
				<Field
					name="publisher"
					type="text"
					component={renderTextField}
					label="Publisher"
				/>
				<Field
					name="address"
					type="text"
					component={renderTextField}
					label="Address"
				/>
				<Field
					name="gender"
					component={renderRadioButton}
					label="Gender"
					options={genderOption}
				/>
				<Field
					name="select"
					component={renderSelect}
					label="Select"
				/>
				<Field
					name="date"
					component={renderPickers}
					label="Date"
				/>
				<Button
					variant="contained"
					color="primary"
					type="submit"
				>
				Submit
				</Button>
			</FormGroup>
		</form>
	);
};

export default reduxForm({form: 'contactForm'})(ContactForm);

ContactForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired
};
