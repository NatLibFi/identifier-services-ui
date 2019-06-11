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
import {Grid, Typography} from '@material-ui/core';
import SearchComponent from '../SearchComponent';
import useStyles from '../../styles/searchComponent';
import {withRouter} from 'react-router-dom';

export default withRouter(props => {
	const classes = useStyles();
	const [inputVal, setInputVal] = useState('');

	const handleInputChange = e => {
		setInputVal(e.target.value);
	};

	const handleSubmit = e => {
		e.preventDefault();
		props.history.push('/publishers');
	};

	return (
		<Grid container>
			<Grid item xs={12} className={classes.searchContianer}>
				<Typography variant="h4" align="center">Explore Finnish Publisher</Typography>
				<SearchComponent
					inputVal={inputVal}
					handleInputChange={handleInputChange}
					handleSubmit={handleSubmit}
				/>
			</Grid>
		</Grid>
	);
}
);
