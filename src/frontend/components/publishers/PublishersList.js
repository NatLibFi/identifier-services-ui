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
/* global API_URL */
/* eslint no-undef: "error" */

import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {useCookies} from 'react-cookie';
import {Grid, Typography, Checkbox, FormControlLabel} from '@material-ui/core';

import SearchComponent from '../SearchComponent';
import useStyles from '../../styles/publisherLists';
import TableComponent from '../TableComponent';
import * as actions from '../../store/actions';
import Spinner from '../Spinner';

export default connect(mapStateToProps, actions)(props => {
	const classes = useStyles();
	const {loading, searchedPublishers, offset, location, searchPublisher, totalDoc, queryDocCount} = props;
	const [cookie] = useCookies('login-cookie');
	const [inputVal, setSearchInputVal] = location.state === undefined ? useState('') : useState(location.state.searchText);
	const [page, setPage] = React.useState(1);
	const [activeCheck, setActiveCheck] = useState({
		checked: false
	});
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);

	useEffect(() => {
		searchPublisher({searchText: inputVal, token: cookie['login-cookie'], offset: lastCursor, activeCheck: activeCheck});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [API_URL, lastCursor, cursors, activeCheck, inputVal, searchPublisher, cookie]);

	const handleChange = name => event => {
		setActiveCheck({...activeCheck, [name]: event.target.checked});
	};

	const handleTableRowClick = id => {
		props.history.push({pathname: `/publishers/${id}`, state: {modal: true, searchText: ''}});
	};

	const headRows = [
		{id: 'name', label: 'Name'},
		{id: 'phone', label: 'Phone'}
	];
	let publishersData;
	if (loading) {
		publishersData = <Spinner/>;
	} else if (searchedPublishers.length === 0) {
		publishersData = <p>No Search Result</p>;
	} else {
		publishersData = (
			<TableComponent
				data={searchedPublishers.map(item => searchResultRender(item.id, item.name, item.phone))}
				handleTableRowClick={handleTableRowClick}
				headRows={headRows}
				offset={offset}
				cursors={cursors}
				page={page}
				setPage={setPage}
				setLastCursor={setLastCursor}
				totalDoc={totalDoc}
				queryDocCount={queryDocCount}
			/>
		);
	}

	function searchResultRender(id, name, phone) {
		return {
			id: id,
			name: name,
			phone: phone
		};
	}

	const component = (
		<Grid>
			<Grid item xs={12} className={classes.publisherListSearch}>
				<Typography variant="h5">Search Publisher By Name or Aliases</Typography>
				<SearchComponent offset={offset} searchFunction={searchPublisher} setSearchInputVal={setSearchInputVal}/>
				<FormControlLabel
					control={
						<Checkbox
							checked={activeCheck.checked}
							value="checked"
							color="primary"
							onChange={handleChange('checked')}
						/>
					}
					label="Show only active publishers"
				/>
				{publishersData}
			</Grid>
		</Grid>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		loading: state.publisher.listLoading,
		searchedPublishers: state.publisher.searchedPublisher,
		publishersList: state.publisher.publishersList,
		offset: state.publisher.offset,
		totalDoc: state.publisher.totalDoc,
		queryDocCount: state.publisher.queryDocCount
	});
}
