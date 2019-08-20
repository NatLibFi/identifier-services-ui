/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
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
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {TextField, InputAdornment, IconButton} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {useCookies} from 'react-cookie';

import useStyles from '../styles/searchComponent';
import * as actions from '../store/actions';

export default connect(null, actions)(withRouter(props => {
	const {searchFunction, history, setSearchInputVal} = props;
	const classes = useStyles();
	const [inputVal, setInputVal] = useState('');
	const [cookie] = useCookies('login-cookie');

	const handleInputChange = e => {
		setInputVal(e.target.value);
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (props.homePage) {
			history.push('/publishers/', {searchText: inputVal});
			searchFunction(inputVal, cookie['login-cookie']);
		} else {
			searchFunction(inputVal, cookie['login-cookie']);
			setSearchInputVal(inputVal);
		}
	};

	const component = (
		<form onSubmit={handleSubmit}>
			<TextField
				id="outlined-bare"
				placeholder="Search..."
				margin="normal"
				variant="outlined"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton onClick={handleSubmit}><SearchIcon/></IconButton>
						</InputAdornment>
					)
				}}
				className={classes.searchBox}
				onChange={handleInputChange}
			/>
		</form>
	);

	return {
		...component
	};
}));
