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
import moment from 'moment';
import {FormattedMessage, useIntl} from 'react-intl';
import {
	Grid,
	FormControlLabel,
	Checkbox,
	Typography
} from '@material-ui/core';

import * as actions from '../../store/actions';
import Spinner from '../Spinner';
import AlertDialogs from '../AlertDialogs';
import TableComponent from '../TableComponent';
import {commonStyles} from '../../styles/app';

export default connect(mapStateToProps, actions)(props => {
	const {fetchIDRList, rangesList, loading, offset, queryDocCount, rangeType, setNewPublisherRangeId, setAssignRange} = props;
	const intl = useIntl();
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const classes = commonStyles();
	const [page, setPage] = React.useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [updateComponent] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState(null);
	const [confirmation, setConfirmation] = useState(false);
	const [rowSelectedId, setRowSelectedId] = useState(null);
	const [activeCheck, setActiveCheck] = useState({
		checked: false
	});

	useEffect(() => {
		fetchIDRList({searchText: '', token: cookie[COOKIE_NAME], offset: lastCursor, activeCheck: activeCheck, rangeType});
	}, [updateComponent, activeCheck, cookie, fetchIDRList, lastCursor, rangeType]);

	useEffect(() => {
		if (confirmation && selectedId !== null) {
			setRowSelectedId(selectedId);
			if (rangeType === 'subRange') {
				setNewPublisherRangeId(selectedId);
				setAssignRange(false);
			}
		}
	}, [confirmation, rangeType, selectedId, setAssignRange, setNewPublisherRangeId]);

	const handleTableRowClick = id => {
		// TO DO alert Confirm message
		setRowSelectedId(id);
		if (id) {
			setMessage('Please confirm to select this range');
			setSelectedId(id);
		}
	};

	function handleOnAgree() {
		setConfirmation(true);
	}

	function handleOnCancel() {
		setConfirmation(false);
	}

	const handleChange = name => event => {
		setActiveCheck({...activeCheck, [name]: event.target.checked});
	};

	function headRows() {
		const headers = getHeaders(rangeType);
		function getHeaders(rangeType) {
			const array = [
				'created',
				'createdBy'
			];
			if (rangeType === 'range') {
				array.unshift('prefix', 'langGroup', 'category', 'rangeStart', 'rangeEnd', 'free', 'taken', 'canceled', 'next', 'active', 'isClosed');
				return array;
			}

			return array;
		}

		return headers.reduce((acc, k) => {
			acc.push({id: `${k}`, label: intl.formatMessage({id: `ranges.${k}`})});
			return acc;
		}, []);
	}

	let data;
	if ((rangesList === undefined) || (loading)) {
		data = <Spinner/>;
	} else if (rangesList.length === 0) {
		data = <p><FormattedMessage id="app.render.noData"/></p>;
	} else {
		data = (
			<TableComponent
				data={rangesList
					.map(item => listRender({...item}))}
				handleTableRowClick={handleTableRowClick}
				rowSelectedId={rowSelectedId}
				headRows={headRows()}
				offset={offset}
				cursors={cursors}
				page={page}
				setPage={setPage}
				setLastCursor={setLastCursor}
				queryDocCount={queryDocCount}
			/>
		);
	}

	function listRender(item) {
		return {
			...item,
			created: moment(item.created.replace('Z', ''), moment.defaultFormat).format('L')
		};
	}

	const component = (
		<Grid>
			<Grid item xs={12} className={classes.listComponent}>
				<Typography variant="h5">
					<FormattedMessage id={`rangesList.title.${rangeType}`}/>
				</Typography>
				<FormControlLabel
					control={
						<Checkbox
							checked={activeCheck.checked}
							value="checked"
							color="primary"
							onChange={handleChange('checked')}
						/>
					}
					label={intl.formatMessage({id: 'rangesList.label.checkbox'})}
				/>
				{data}
			</Grid>
			{
				message &&
					<AlertDialogs
						openAlert={openAlert}
						setOpenAlert={setOpenAlert}
						message={message}
						setMessage={setMessage}
						handleOnAgree={handleOnAgree}
						handleOnCancel={handleOnCancel}
					/>
			}
		</Grid>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		loading: state.identifierRanges.rangeListLoading,
		rangesList: state.identifierRanges.rangesList,
		offset: state.identifierRanges.offset,
		totalDoc: state.identifierRanges.totalDoc,
		queryDocCount: state.identifierRanges.queryDocCount
	});
}
