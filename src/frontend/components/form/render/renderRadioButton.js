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
import {Radio, FormControlLabel, RadioGroup, FormLabel} from '@material-ui/core';

export default function (props) {
	const {input, options, name, publicationValues, clearFields, label, className} = props;
	const {meta: {touched, error}} = props;

	function handleChangeWithPublicationValues(value) {
		input.onChange(value);
		const Keys = Object.keys(publicationValues);
		Keys.map(key => {
			switch (key) {
				case 'select':
					return publicationValues && publicationValues.select !== value &&
					clearFields(undefined, false, false, publicationValues.select);
				case 'selectFormat':
					return publicationValues && publicationValues.selectFormat !== value &&
					Object.keys(publicationValues && publicationValues.formatDetails).map(item => clearFields(undefined, false, false, `formatDetails[${item}]`));
				default:
					return null;
			}
		});
	}

	function handleChange(value) {
		return input.onChange(value);
	}

	const component = (
		<>
			<FormLabel component="legend">{label}</FormLabel>
			<RadioGroup
				{...input}
				aria-label={label}
				name={name}
				className={className}
				error={touched && Boolean(error)}
				value={input.value}
				onChange={value => {
					if (publicationValues) {
						return handleChangeWithPublicationValues(value);
					}

					return handleChange(value);
				}}
			>
				{
					options.map(item => (
						<FormControlLabel
							key={item.value}
							value={item.value}
							control={<Radio color="primary"/>}
							label={item.label}
						/>
					))
				}
			</RadioGroup>
		</>
	);

	return {
		...component
	};
}
