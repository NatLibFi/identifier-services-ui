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
import {PropTypes} from 'prop-types';
// Import {Radio, FormControlLabel, RadioGroup, FormLabel, TextField} from '@material-ui/core';
import {TextField, InputAdornment, Typography, RadioGroup, FormControlLabel, Radio} from '@material-ui/core';
import ErrorIcons from '@material-ui/icons/ErrorOutline';

import useStyles from '../../../styles/form';
import useErrorStyles from '../../../styles/error';

export default function (props) {
	const {input, className, style, options, meta, clearFields, disabled, placeholder, setPlaceholder, defaultValue} = props;
	const {touched, error} = meta;
	const errorClasses = useErrorStyles();
	const classes = useStyles();

	function handleChange(event) {
		clearFields(undefined, false, false, placeholder);
		setPlaceholder(event.target.value);
	}

	const component = (
		<>
			<RadioGroup
				className={classes[`${style}`]}
				onChange={handleChange}
			>
				{options.map(item => (
					<FormControlLabel
						key={item.value}
						value={item.value}
						control={<Radio color="primary"/>}
						label={item.label}
					/>
				))}
			</RadioGroup>
			<TextField
				{...input}
				label={placeholder}
				disabled={disabled}
				value={defaultValue}
				type="text"
				className={className}
				error={touched && Boolean(error)}
				InputProps={{
					endAdornment:
	<InputAdornment position="end">
		<>
			{touched && (error &&
				<Typography variant="caption" color="error" className={errorClasses.errors}><ErrorIcons fontSize="inherit"/>{error}</Typography>
			)}
		</>
	</InputAdornment>
				}}
			/>

		</>
	);

	return {
		...component,
		defaultProps: {
			meta: {error: undefined}
		},
		propTypes: {
			input: PropTypes.shape({}).isRequired,
			label: PropTypes.string.isRequired,
			className: PropTypes.string.isRequired,
			type: PropTypes.string.isRequired,
			meta: PropTypes.shape({touched: PropTypes.bool, error: PropTypes.string})
		}
	};
}

