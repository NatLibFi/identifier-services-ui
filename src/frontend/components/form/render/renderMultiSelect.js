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
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import ErrorIcons from '@material-ui/icons/ErrorOutline';
import {Typography} from '@material-ui/core';

import useStyles from '../../../styles/error';

export default function (props) {
	const {input, label, options, className, isMulti, infoIconComponent, creatable} = props;
	const {meta: {touched, error}} = props;
	const classes = useStyles();

	const component = (
		<>
			<div style={{display: 'flex'}}>
				<Typography>{label && label}&nbsp;</Typography>
				{infoIconComponent}
			</div>
			{creatable === false ?
				<Select
					isMulti={isMulti}
					{...input}
					error={touched && error}
					options={options}
					className={className}
					placeholder={label}
					value={input.value}
					onBlur={() => input.onBlur(input.value)}
					onChange={value => input.onChange(value)}
				/> :
				<CreatableSelect
					isMulti={isMulti}
					{...input}
					error={touched && error}
					options={options}
					className={className}
					placeholder={label}
					value={input.value}
					onBlur={() => input.onBlur(input.value)}
					onChange={value => input.onChange(value)}
				/>}
			{touched && error &&
				<Typography variant="caption" color="error" className={classes.selectErrors}>
					<ErrorIcons fontSize="inherit"/>{error}
				</Typography>}
		</>
	);

	return {
		...component
	};
}
