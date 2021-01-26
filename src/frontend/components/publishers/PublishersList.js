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
import {useCookies} from 'react-cookie';
import {Grid, Typography, Checkbox, FormControlLabel} from '@material-ui/core';
import {FormattedMessage, useIntl} from 'react-intl';

import SearchComponent from '../SearchComponent';
import {commonStyles} from '../../styles/app';
import TableComponent from '../TableComponent';
import * as actions from '../../store/actions';
import Spinner from '../Spinner';

export default connect(mapStateToProps, actions)(props => {
	const classes = commonStyles();
	const {loading, searchedPublishers, offset, location, searchPublisher, totalDoc, queryDocCount, history} = props;
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const intl = useIntl();
	const [inputVal, setSearchInputVal] = (location.state === undefined || location.state === null) ? useState('') : useState(location.state.searchText);
	const [page, setPage] = React.useState(1);
	const [activeCheck, setActiveCheck] = useState({
		checked: false
	});
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [rowSelectedId, setRowSelectedId] = useState(null);

	useEffect(() => {
		searchPublisher({searchText: inputVal, token: cookie[COOKIE_NAME], offset: lastCursor, activeCheck: activeCheck});
	}, [lastCursor, cursors, activeCheck, inputVal, searchPublisher, cookie]);

	const handleChange = name => event => {
		setActiveCheck({...activeCheck, [name]: event.target.checked});
	};

	const handleTableRowClick = id => {
		history.push(`/publishers/${id}`);
		setRowSelectedId(id);
	};

	const headRows = [
		{id: 'name', label: intl.formatMessage({id: 'publisherList.headRows.name'})},
		{id: 'phone', label: intl.formatMessage({id: 'publisherList.headRows.phone'})}
	];
	let publishersData;
	if (loading) {
		publishersData = <Spinner/>;
	} else if (searchedPublishers === null || searchedPublishers.length === 0) {
		publishersData = <p><FormattedMessage id="publisherList.emptySearch"/></p>;
	} else {
		publishersData = (
			<TableComponent
				data={searchedPublishers.map(item => searchResultRender(item.id, item.name, item.phone))}
				handleTableRowClick={handleTableRowClick}
				headRows={headRows}
				rowSelectedId={rowSelectedId}
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
		<Grid item xs={12} className={classes.listSearch}>
			<Typography variant="h5"><FormattedMessage id="publisher.search.title"/></Typography>
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
				label={<FormattedMessage id="publisher.search.filter"/>}
			/>
			{publishersData}
		</Grid>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		loading: state.publisher.searchListLoading,
		searchedPublishers: state.publisher.searchedPublisher,
		publishersList: state.publisher.publishersList,
		offset: state.publisher.offset,
		totalDoc: state.publisher.totalDoc,
		queryDocCount: state.publisher.queryDocCount
	});
}
