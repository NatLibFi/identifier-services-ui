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
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import useStyles from '../../styles/form';

import PublicationRegistrationForm from './PublicationRegistrationForm';
import PublicationRegIssnForm from './PublicationRegIssnForm';

export default function (props) {
	const [value, setValue] = React.useState('isbn-ismn');
	const classes = useStyles();

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const component = (
		<>
			<Paper square className={classes.switchPubPaper}>
				<Tabs
					value={value}
					indicatorColor="primary"
					textColor="primary"
					aria-label="disabled tabs example"
					onChange={handleChange}
				>
					<Tab label="ISBN-ISMN" value="isbn-ismn"/>
					<Tab label="ISSN" value="issn"/>
				</Tabs>
			</Paper>
			{value === 'isbn-ismn' ? <PublicationRegistrationForm {...props}/> : <PublicationRegIssnForm {...props}/>}
		</>
	);

	return {
		...component
	};
}
