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
import {FormattedMessage, useIntl} from 'react-intl';

import * as actions from '../../../store/actions';
import Spinner from '../../Spinner';
import TableComponent from '../../TableComponent';
import {commonStyles} from '../../../styles/app';
import SearchComponent from '../../SearchComponent';
import Ismn from './Ismn';
import RangeCreationForm from '../../form/RangeCreationForm';
import ModalLayout from '../../ModalLayout';

export default connect(mapStateToProps, actions)(props => {
	const {fetchIDRIsmnList, ismnList, loading, offset, queryDocCount, userInfo} = props;
	const intl = useIntl();
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const classes = commonStyles();
	const [inputVal, setSearchInputVal] = useState('');
	const [page, setPage] = React.useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [modal, setModal] = useState(false);
	const [ismnId, setIsmnId] = useState(null);
	const [updateComponent, setUpdateComponent] = useState(false);

	const [activeCheck, setActiveCheck] = useState({
		checked: false
	});
	const [rowSelectedId, setRowSelectedId] = useState(null);

	useEffect(() => {
		fetchIDRIsmnList({searchText: inputVal, token: cookie[COOKIE_NAME], offset: lastCursor, activeCheck: activeCheck});
	}, [activeCheck, cookie, fetchIDRIsmnList, inputVal, lastCursor, updateComponent]);

	const handleTableRowClick = id => {
		setIsmnId(id);
		setModal(true);
		setRowSelectedId(id);
	};

	const handleChange = name => event => {
		setActiveCheck({...activeCheck, [name]: event.target.checked});
	};

	const headRows = [
		{id: 'prefix', label: intl.formatMessage({id: 'ranges.prefix'})},
		{id: 'rangeStart', label: intl.formatMessage({id: 'ranges.rangeStart'})},
		{id: 'rangeEnd', label: intl.formatMessage({id: 'ranges.rangeEnd'})}
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
		<Grid item xs={12} className={classes.listSearch}>
			<Typography variant="h5">
				<FormattedMessage id="ismnList.title.search"/>
			</Typography>
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
				label={intl.formatMessage({id: 'ismnList.label.checkbox'})}
			/>
			{
				userInfo.role === 'admin' &&
					<ModalLayout
						form
						label={intl.formatMessage({id: 'ismnList.label.button.create'})}
						title={intl.formatMessage({id: 'ismnList.label.button.create'})}
						name="issnCreationRange"
						variant="outlined"
						color="primary"
					>
						<RangeCreationForm setUpdateComponent={setUpdateComponent} {...props}/>
					</ModalLayout>
			}
			{ismnData}
			<Ismn id={ismnId} modal={modal} setModal={setModal}/>
		</Grid>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		userInfo: state.login.userInfo,
		loading: state.identifierRanges.rangeListLoading,
		ismnList: state.identifierRanges.ismnList,
		offset: state.identifierRanges.offset,
		totalDoc: state.identifierRanges.totalDoc,
		queryDocCount: state.identifierRanges.queryDocCount
	});
}
