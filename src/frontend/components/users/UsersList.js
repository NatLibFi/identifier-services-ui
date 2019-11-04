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

import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Grid, Typography} from '@material-ui/core';

import {commonStyles} from '../../styles/app';
import TableComponent from '../TableComponent';
import User from './User';
import * as actions from '../../store/actions';
import Spinner from '../Spinner';
import {useCookies} from 'react-cookie';

export default connect(mapStateToProps, actions)(props => {
	const classes = commonStyles();
	const {loading, fetchUsersList, usersList, totalUsers, queryDocCount, offset} = props;
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [page, setPage] = useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [modal, setModal] = useState(false);
	const [userId, setUserId] = useState(null);
	const [rowSelectedId, setRowSelectedId] = useState(null);

	useEffect(() => {
		fetchUsersList(cookie[COOKIE_NAME], lastCursor);
	}, [lastCursor, cursors, fetchUsersList, cookie]);

	const handleTableRowClick = id => {
		setUserId(id);
		setModal(true);
		setRowSelectedId(id);
	};

	const headRows = [
		{id: 'publisher', label: 'Publisher'},
		{id: 'defaultLanguage', label: 'Language'}
	];
	let usersData;
	if (loading) {
		usersData = <Spinner/>;
	} else if (usersList === undefined || usersList === null) {
		usersData = <p>No Users Available</p>;
	} else {
		usersData = (
			<TableComponent
				data={usersList.map(item => usersDataRender(item))}
				handleTableRowClick={handleTableRowClick}
				rowSelectedId={rowSelectedId}
				headRows={headRows}
				offset={offset}
				cursors={cursors}
				page={page}
				setPage={setPage}
				setLastCursor={setLastCursor}
				totalDoc={totalUsers}
				queryDocCount={queryDocCount}
			/>
		);
	}

	function usersDataRender(item) {
		const {id, publisher, preferences} = item;
		return {
			id: id,
			publisher: publisher,
			defaultLanguage: preferences.defaultLanguage
		};
	}

	const component = (
		<Grid>
			<Grid item xs={12} className={classes.listSearch}>
				<Typography variant="h5">List of Avaiable users</Typography>
				{usersData}
				<User id={userId} modal={modal} setModal={setModal}/>
			</Grid>
		</Grid>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		loading: state.users.listLoading,
		usersList: state.users.usersList,
		userInfo: state.login.userInfo,
		totalUsers: state.users.totalUsers,
		offset: state.users.offset,
		queryDocCount: state.users.queryDocCount
	});
}
