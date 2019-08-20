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

import React, {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {connect} from 'react-redux';
import {Grid, Typography} from '@material-ui/core';

import * as actions from '../../store/actions';
import Spinner from '../Spinner';
import TableComponent from '../TableComponent';
import useStyles from '../../styles/publisherLists';
import SearchComponent from '../SearchComponent';

export default connect(mapStateToProps, actions)(props => {
	const {fetchPublishersRequestsList, publishersRequestsList, loading, offset, queryDocCount, apiURL} = props;
	const [cookie] = useCookies('login-cookie');
	const classes = useStyles();
	const [inputVal, setSearchInputVal] = useState('');
	const [page, setPage] = React.useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);

	useEffect(() => {
		// eslint-disable-next-line no-unused-expressions
		apiURL !== null && fetchPublishersRequestsList({API_URL: apiURL}, inputVal, cookie['login-cookie'], lastCursor);
	}, [cookie, fetchPublishersRequestsList, inputVal, lastCursor, apiURL]);

	const handleTableRowClick = id => {
		props.history.push(`/requests/publishers/${id}`, {modal: true});
	};

	const headRows = [
		{id: 'name', label: 'Name'},
		{id: 'language', label: 'Language'}
	];

	let publishersRequestsData;
	if ((publishersRequestsList === undefined) || (loading)) {
		publishersRequestsData = <Spinner/>;
	} else if (publishersRequestsList.length === 0) {
		publishersRequestsData = <p>No Data</p>;
	} else {
		publishersRequestsData = (
			<TableComponent
				data={publishersRequestsList
					.map(item => publishersRequestsRender(item.id, item.name, item.language))}
				handleTableRowClick={handleTableRowClick}
				headRows={headRows}
				offset={offset}
				cursors={cursors}
				page={page}
				setPage={setPage}
				setLastCursor={setLastCursor}
				queryDocCount={queryDocCount}
			/>
		);
	}

	function publishersRequestsRender(id, name, language) {
		return {
			id: id,
			name: name,
			language: language
		};
	}

	const component = (
		<Grid>
			<Grid item xs={12} className={classes.publisherListSearch}>
				<Typography variant="h5">Search Publishers Request</Typography>
				<SearchComponent searchFunction={fetchPublishersRequestsList} setSearchInputVal={setSearchInputVal}/>
				{publishersRequestsData}
			</Grid>
		</Grid>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		loading: state.publisher.loading,
		publishersRequestsList: state.publisher.publishersRequestsList,
		offset: state.publisher.offset,
		totalDoc: state.publisher.totalDoc,
		queryDocCount: state.publisher.queryDocCount,
		apiURL: state.common.apiURL
	});
}
