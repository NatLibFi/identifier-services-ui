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
import {PropTypes} from 'prop-types';
import {Checkbox, FormControlLabel, FormLabel, FormGroup} from '@material-ui/core';

export default function (props) {
	const {fields, label, options, className, input, name, meta: {touched, error}} = props;
	const [state] = useState({[name]: []});

	function handleOnChange(value) {
		if (state[name].includes(value)) {
			const index = state[name].indexOf(value);
			state[name].splice(index, 1);
			fields.removeAll();
			state[name].forEach(item => fields.push(item));
		} else {
			state[name].push(value);
			fields.removeAll();
			fields.push(state[name]);
		}
	}

	const component = (
		<>
			<FormLabel component="legend">{label}</FormLabel>
			<FormGroup>
				{options.map(item => (
					<FormControlLabel
						{...input}
						key={item.label}
						label={item.label}
						className={className}
						control={
							<Checkbox
								{...input}
								error={touched ? error : undefined}
								value={item.value}
								color="primary"
								onChange={() => handleOnChange(item.value)}
							/>
						}
					/>
				))}
			</FormGroup>
		</>
	);

	return {
		...component,
		defaultProps: {
			meta: {},
			input: {}
		},
		propTypes: {
			input: PropTypes.shape({}),
			options: PropTypes.shape({
				name: PropTypes.string.isRequired,
				label: PropTypes.string.isRequired,
				value: PropTypes.string.isRequired
			}).isRequired,
			label: PropTypes.string.isRequired,
			className: PropTypes.string.isRequired,
			meta: PropTypes.shape({touched: PropTypes.bool, error: PropTypes.string})
		}
	};
}
