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
import {Button, Typography} from '@material-ui/core';
import useStyles from '../../styles/form';

import IsbnIsmnRegForm from './IsbnIsmnRegForm';
import IssnRegForm from './IssnRegForm';

export default function (props) {
	const {setTitle} = props;
	const [value, setValue] = useState('');
	const classes = useStyles();

	const handleIsbnIsmnClick = () => {
		setValue('isbn-ismn');
		setTitle('ISBN-ISMN');
	};

	const handleIssnClick = () => {
		setValue('issn');
		setTitle('ISSN');
	};

	const component = (
		<>
			{value === '' ?
				<>
					<Typography variant="caption">Choose:</Typography>
					<div className={classes.pubFormSelect}>
						<Button variant="contained" color="primary" onClick={handleIsbnIsmnClick}>ISBN-ISMN</Button>
						<Button variant="contained" color="primary" onClick={handleIssnClick}>ISSN</Button>
					</div>
				</> :
				value === 'isbn-ismn' ? <IsbnIsmnRegForm {...props}/> : <IssnRegForm {...props}/>}
		</>
	);

	return {
		...component
	};
}
