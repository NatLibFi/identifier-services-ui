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
import {Input, InputLabel, NativeSelect, FormControl, Box, Typography} from '@material-ui/core';
import ErrorIcons from '@material-ui/icons/ErrorOutline';

import useStyles from '../../../styles/error';

export default function (props) {
	const classes = useStyles();
	const {
		label,
		input,
		name,
		options,
		className,
		defaultValue,
		disabled,
		publicationValues,
		clearFields
	} = props;
	const {meta: {touched, error}} = props;

	const component = (
		<>
			<FormControl className={className} error={touched && error} disabled={disabled}>
				<InputLabel htmlFor="language-helper">{label}</InputLabel>
				<NativeSelect
					{...input}
					error={touched && error}
					input={<Input name={name} id="language-helper"/>}
					value={input.value}
					onChange={value => {
						input.onChange(value);
						if (publicationValues && publicationValues.type !== value) {
							clearFields(undefined, false, false, 'formatDetails[url]');
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
			{touched && error &&
				<Box mt={2}>
					<Typography variant="caption" color="error" className={classes.selectErrors}><ErrorIcons fontSize="inherit"/>{error}</Typography>
				</Box>}
		</>
	);

	return {
		...component
	};
}
