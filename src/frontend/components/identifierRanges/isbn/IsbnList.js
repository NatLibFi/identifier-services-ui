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
import {Grid, Typography, FormControlLabel, Checkbox} from '@material-ui/core';

import * as actions from '../../../store/actions';
import Spinner from '../../Spinner';
import TableComponent from '../../TableComponent';
import {commonStyles} from '../../../styles/app';
import SearchComponent from '../../SearchComponent';
import Isbn from './Isbn';

export default connect(mapStateToProps, actions)(props => {
	const {fetchIDRIsbnList, isbnList, loading, offset, queryDocCount} = props;
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const classes = commonStyles();
	const [inputVal, setSearchInputVal] = useState('');
	const [page, setPage] = React.useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [modal, setModal] = useState(false);
	const [isbnId, setIsbnId] = useState(null);
	const [activeCheck, setActiveCheck] = useState({
		checked: false
	});
	const [rowSelectedId, setRowSelectedId] = useState(null);

	useEffect(() => {
		fetchIDRIsbnList({searchText: inputVal, token: cookie[COOKIE_NAME], offset: lastCursor, activeCheck: activeCheck});
	}, [activeCheck, cookie, fetchIDRIsbnList, inputVal, lastCursor]);

	const handleTableRowClick = id => {
		setIsbnId(id);
		setModal(true);
		setRowSelectedId(id);
	};

	const handleChange = name => event => {
		setActiveCheck({...activeCheck, [name]: event.target.checked});
	};

	const headRows = [
		{id: 'prefix', label: 'Prefix'},
		{id: 'rangeStart', label: 'RangeStart'},
		{id: 'rangeEnd', label: 'RangeEnd'}
	];

	let isbnData;
	if ((isbnList === undefined) || (loading)) {
		isbnData = <Spinner/>;
	} else if (isbnList.length === 0) {
		isbnData = <p>No Data</p>;
	} else {
		isbnData = (
			<TableComponent
				data={isbnList
					.map(item => isbnListRender(item.id, item.prefix, item.rangeStart, item.rangeEnd))}
				handleTableRowClick={handleTableRowClick}
				rowSelectedId={rowSelectedId}
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

	function isbnListRender(id, prefix, rangeStart, rangeEnd) {
		return {
			id: id,
			prefix: prefix,
			rangeStart: rangeStart,
			rangeEnd: rangeEnd
		};
	}

	const component = (
		<Grid>
			<Grid item xs={12} className={classes.listSearch}>
				<Typography variant="h5">Search Identifier Ranges ISBN</Typography>
				<SearchComponent searchFunction={fetchIDRIsbnList} setSearchInputVal={setSearchInputVal}/>
				<FormControlLabel
					control={
						<Checkbox
							checked={activeCheck.checked}
							value="checked"
							color="primary"
							onChange={handleChange('checked')}
						/>
					}
					label="Show only active ISBN"
				/>
				{isbnData}
				<Isbn id={isbnId} modal={modal} setModal={setModal}/>
			</Grid>
		</Grid>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		loading: state.identifierRanges.listLoading,
		isbnList: state.identifierRanges.isbnList,
		offset: state.identifierRanges.offset,
		totalDoc: state.identifierRanges.totalDoc,
		queryDocCount: state.identifierRanges.queryDocCount
	});
}
