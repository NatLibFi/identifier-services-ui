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
import {TextField} from '@material-ui/core';

export default function ({input, label, className, meta: {touched, error}, children}) {
	const component = (
		<TextField
			{...input}
			multiline
			label={label}
			variant="outlined"
			rows={6}
			className={className}
			error={touched && Boolean(error)}
		>
			{children}
		</TextField>
	);

	return {
		...component,
		defaultProps: {
			meta: {},
			children: null,
			multiline: false
		},
		propTypes: {
			input: PropTypes.shape({}).isRequired,
			label: PropTypes.string.isRequired,
			className: PropTypes.string.isRequired,
			multiline: PropTypes.bool,
			meta: PropTypes.shape({touched: PropTypes.bool, error: PropTypes.bool}),
			children: PropTypes.node
		}
	};
}
