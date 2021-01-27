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
import {useCookies} from 'react-cookie';
import {FormattedMessage, useIntl} from 'react-intl';

import SearchComponent from '../SearchComponent';
import {commonStyles} from '../../styles/app';
import useModalStyles from '../../styles/formList';
import TableComponent from '../TableComponent';
import * as actions from '../../store/actions';
import Spinner from '../Spinner';
import ModalLayout from '../ModalLayout';
import UserRequestForm from '../form/UserCreationForm';
import TabComponent from '../TabComponent';

export default connect(mapStateToProps, actions)(props => {
	const classes = commonStyles();
	const modalClasses = useModalStyles();
	const {loading, fetchUsersRequestsList, usersRequestsList, queryDocCount, totalDoc, offset, userInfo, history} = props;
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const intl = useIntl();
	const [inputVal, setSearchInputVal] = useState('');
	const [sortStateBy, setSortStateBy] = useState('');
	const [page, setPage] = useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [isCreating, setIsCreating] = useState(false);
	const [rowSelectedId, setRowSelectedId] = useState(null);
	useEffect(() => {
		fetchUsersRequestsList({searchText: inputVal, sortStateBy: sortStateBy, token: cookie[COOKIE_NAME], offset: lastCursor});
		setIsCreating(false);
	}, [lastCursor, cursors, inputVal, sortStateBy, fetchUsersRequestsList, cookie, isCreating]);

	const handleTableRowClick = id => {
		history.push(`/requests/users/${id}`);
		setRowSelectedId(id);
	};

	const handleChange = (event, newValue) => {
		setSortStateBy(newValue);
	};

	const headRows = [
		{id: 'state', label: intl.formatMessage({id: 'userRequest.headRows.state'})},
		{id: 'publisher', label: intl.formatMessage({id: 'userRequest.headRows.publisher'})},
		{id: 'email', label: intl.formatMessage({id: 'userRequest.headRows.email'})}

	];
	let usersData;
	if ((usersRequestsList === undefined) || (loading)) {
		usersData = <Spinner/>;
	} else if (usersRequestsList.length === 0) {
		usersData = <p>No Requests Available</p>;
	} else {
		usersData = (
			<TableComponent
				data={usersRequestsList.map(item => usersDataRender(item.id, item.state, item.publisher, item.email))}
				handleTableRowClick={handleTableRowClick}
				rowSelectedId={rowSelectedId}
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

	function usersDataRender(id, state, publisher, email) {
		return {
			id: id,
			state: state,
			publisher: publisher,
			email: email
		};
	}

	const component = (
		<Grid item xs={12} className={classes.listSearch}>
			<Typography variant="h5">
				<FormattedMessage id="userRequest.listAvailable"/>
			</Typography>
			<SearchComponent offset={offset} searchFunction={fetchUsersRequestsList} setSearchInputVal={setSearchInputVal}/>
			<TabComponent
				sortStateBy={sortStateBy}
				handleChange={handleChange}
			/>
			{
				userInfo.role === 'publisher-admin' &&
					<ModalLayout
						form
						label={intl.formatMessage({id: 'app.modal.title.newUserRequest'})}
						title={intl.formatMessage({id: 'app.modal.title.newUserRequest'})}
						name="userRequest"
						variant="outlined"
						classed={modalClasses.button}
						color="primary"
					>
						<UserRequestForm setIsCreating={setIsCreating} {...props}/>
					</ModalLayout>
			}
			{usersData}
		</Grid>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		loading: state.users.listLoading,
		usersRequestsList: state.users.usersRequestsList,
		offset: state.users.requestOffset,
		totalDoc: state.users.totalUsersRequests,
		queryDocCount: state.users.queryDocCount,
		userInfo: state.login.userInfo
	});
}
