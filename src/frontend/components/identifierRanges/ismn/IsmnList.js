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
import Ismn from './Ismn';

export default connect(mapStateToProps, actions)(props => {
	const {fetchIDRIsmnList, ismnList, loading, offset, queryDocCount} = props;
	const [cookie] = useCookies('login-cookie');
	const classes = commonStyles();
	const [inputVal, setSearchInputVal] = useState('');
	const [page, setPage] = React.useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [modal, setModal] = useState(false);
	const [ismnId, setIsmnId] = useState(null);
	const [activeCheck, setActiveCheck] = useState({
		checked: false
	});
	const [rowSelectedId, setRowSelectedId] = useState(null);

	useEffect(() => {
		fetchIDRIsmnList(inputVal, cookie['login-cookie'], lastCursor, activeCheck);
	}, [activeCheck, cookie, fetchIDRIsmnList, inputVal, lastCursor]);

	const handleTableRowClick = id => {
		setIsmnId(id);
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

	let ismnData;
	if ((ismnList === undefined) || (loading)) {
		ismnData = <Spinner/>;
	} else if (ismnList.length === 0) {
		ismnData = <p>No Data</p>;
	} else {
		ismnData = (
			<TableComponent
				data={ismnList
					.map(item => ismnListRender(item.id, item.prefix, item.rangeStart, item.rangeEnd))}
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

	function ismnListRender(id, prefix, rangeStart, rangeEnd) {
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
				<Typography variant="h5">Search Identifier Ranges ISMN</Typography>
				<SearchComponent searchFunction={fetchIDRIsmnList} setSearchInputVal={setSearchInputVal}/>
				<FormControlLabel
					control={
						<Checkbox
							checked={activeCheck.checked}
							value="checked"
							color="primary"
							onChange={handleChange('checked')}
						/>
					}
					label="Show only active ISMN"
				/>
				{ismnData}
				<Ismn id={ismnId} modal={modal} setModal={setModal}/>
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
		ismnList: state.identifierRanges.ismnList,
		offset: state.identifierRanges.offset,
		totalDoc: state.identifierRanges.totalDoc,
		queryDocCount: state.identifierRanges.queryDocCount
	});
}
