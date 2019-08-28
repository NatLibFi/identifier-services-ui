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

import useStyles from '../../../styles/publisherLists';
import TableComponent from '../../TableComponent';
import * as actions from '../../../store/actions';
import Spinner from '../../Spinner';
import {useCookies} from 'react-cookie';

export default connect(mapStateToProps, actions)(props => {
	const classes = useStyles();
	const {loading, fetchIssnList, issnList, totalpublication, offset, queryDocCount} = props;
	const [cookie] = useCookies('login-cookie');
	const [page, setPage] = useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	useEffect(() => {
		fetchIssnList({token: cookie['login-cookie'], offset: lastCursor});
	}, [lastCursor, cursors, fetchIssnList, cookie]);

	const handleTableRowClick = id => {
		props.history.push(`/publication/issn/${id}`, {modal: true});
	};

	const headRows = [
		{id: 'title', label: 'Title'},
		{id: 'state', label: 'State'},
		{id: 'frequency', label: 'Frequency'},
		{id: 'firstNumber', label: 'First Number'}
	];
	let usersData;
	if (loading) {
		usersData = <Spinner/>;
	} else if (issnList === undefined || issnList === null) {
		usersData = <p>No Publication Available</p>;
	} else {
		usersData = (
			<TableComponent
				data={issnList.map(item => usersDataRender(item))}
				handleTableRowClick={handleTableRowClick}
				headRows={headRows}
				offset={offset}
				page={page}
				setPage={setPage}
				cursors={cursors}
				setLastCursor={setLastCursor}
				totalDoc={totalpublication}
				queryDocCount={queryDocCount}
			/>
		);
	}

	function usersDataRender(item) {
		const {id, title, state, firstNumber, frequency} = item;
		return {
			id: id,
			title: title,
			state: state,
			firstNumber: firstNumber,
			frequency: frequency
		};
	}

	const component = (
		<Grid>
			<Grid item xs={12} className={classes.publisherListSearch}>
				<Typography variant="h5">List of Avaiable Publication</Typography>
				{usersData}
			</Grid>
		</Grid>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		loading: state.publication.loading,
		issnList: state.publication.issnList,
		totalpublication: state.publication.totalDoc,
		offset: state.publication.offset,
		queryDocCount: state.publication.queryDocCount
	});
}
