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
import {Typography, Tabs, Tab} from '@material-ui/core';
import useStyles from '../styles/tabComponent';

export default function (props) {
	const classes = useStyles();
	const {sortStateBy, handleChange} = props;
	const component = (
		<>
			<Tabs
				className={classes.tabs}
				value={sortStateBy}
				indicatorColor="primary"
				textColor="primary"
				variant="outlined"
				onChange={handleChange}
			>
				<Typography variant="overline">Filter State By :</Typography>
				<Tab className={classes.tab} value="new" label="New"/>
				<Tab className={classes.tab} value="inProgress" label="InProgress"/>
				<Tab className={classes.tab} value="accepted" label="Accepted"/>
				<Tab className={classes.tab} value="rejected" label="Rejected"/>
				<Tab className={classes.tab} value="" label="ShowAll"/>
			</Tabs>
		</>
	);
	return {
		...component
	};
}
