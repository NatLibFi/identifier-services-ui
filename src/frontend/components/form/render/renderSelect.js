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
import {Input, InputLabel, NativeSelect, FormControl} from '@material-ui/core';

export default function ({
	label,
	input,
	name,
	options,
	className,
	defaultValue,
	meta: {touched, error},
	publicationValues,
	clearFields}) {
	const component = (
		<FormControl className={className}>
			<InputLabel htmlFor="language-helper">{label}</InputLabel>
			<NativeSelect
				{...input}
				error={touched && Boolean(error)}
				input={<Input name={name} id="language-helper"/>}
				value={input.value}
				onChange={value => {
					input.onChange(value);
					if (publicationValues && publicationValues.type !== value) {
						clearFields(undefined, false, false, 'mapDetails[scale]');
					}
				}}
			>
				{
					options.map(item =>
						<option key={item.value} defaultValue={defaultValue} value={item.value}>{item.label}</option>
					)
				}
			</NativeSelect>
		</FormControl>
	);

	return {
		...component,
		defaultProps: {
			meta: {},
			input: {}
		},
		propTypes: {
			input: PropTypes.shape({}),
			label: PropTypes.string.isRequired,
			meta: PropTypes.shape({touched: PropTypes.bool, error: PropTypes.bool})
		}
	};
}
