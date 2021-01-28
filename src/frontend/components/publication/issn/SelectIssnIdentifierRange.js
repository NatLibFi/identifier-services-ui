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
import {FormattedMessage, useIntl} from 'react-intl';
import {
	Grid,
	FormControlLabel,
	Checkbox,
	Typography
} from '@material-ui/core';

import * as actions from '../../../store/actions';
import Spinner from '../../Spinner';
import TableComponent from '../../TableComponent';
import {commonStyles} from '../../../styles/app';
import AlertDialogs from '../../AlertDialogs';

export default connect(mapStateToProps, actions)(props => {
	const {
		fetchIDRIssnList,
		rangesList,
		rangeLoading,
		offset,
		queryDocCount,
		setRangeBlockId
	} = props;
	const intl = useIntl();
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const classes = commonStyles();
	const [page, setPage] = React.useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [activeCheck, setActiveCheck] = useState({
		checked: false
	});

	const [rowSelectedId, setRowSelectedId] = useState(null);
	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState(null);
	const [confirmation, setConfirmation] = useState(false);
	const [selectedId, setSelectedId] = useState(null);

	useEffect(() => {
		fetchIDRIssnList({searchText: '', token: cookie[COOKIE_NAME], offset: lastCursor, activeCheck: activeCheck});
	}, [cookie, lastCursor, activeCheck, fetchIDRIssnList]);

	useEffect(() => {
		if (confirmation && selectedId !== null) {
			setRowSelectedId(selectedId);
			setRangeBlockId(selectedId);
		}
	}, [confirmation, selectedId, setRangeBlockId]);

	const handleTableRowClick = id => {
		// TO DO alert Confirm message
		if (id) {
			setMessage('Please Confirm to select this subRange');
			setSelectedId(id);
		}
	};

	const handleChange = name => event => {
		setActiveCheck({...activeCheck, [name]: event.target.checked});
	};

	function handleOnAgree() {
		setConfirmation(true);
	}

	function handleOnCancel() {
		setConfirmation(false);
	}

	function headRows() {
		const headers = getHeaders();
		function getHeaders() {
			const array = [
				'created',
				'createdBy'
			];
			array.unshift('rangeStart', 'rangeEnd', 'free', 'taken', 'canceled', 'next', 'active', 'isClosed');

			return array;
		}

		return headers.reduce((acc, k) => {
			acc.push({id: `${k}`, label: intl.formatMessage({id: `ranges.${k}`})});
			return acc;
		}, []);
	}

	let data;
	if (rangesList === undefined || rangeLoading) {
		data = <Spinner/>;
	} else if (rangesList.length === 0) {
		data =
			(
				<Typography variant="h6">
					Range Not found
				</Typography>
			);
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
		const sortBy = ['rangeStart', 'rangeEnd', 'free', 'taken', 'canceled', 'next', 'active', 'isClosed', 'id'];
		const sortedItem = sortBy.reduce((acc, k) => {
			acc = {...acc, [k]: item[k]};
			return acc;
		}, {});
		return sortedItem;
	}

	const component = (
		<Grid>
			<Grid item xs={12} className={classes.listComponent}>
				<Typography variant="h5">
					<FormattedMessage id="rangesList.title.range"/>
				</Typography>
				<>
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
				</>
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
		rangeLoading: state.identifierRanges.rangeListLoading,
		rangesList: state.identifierRanges.issnList,
		offset: state.identifierRanges.offset,
		totalDoc: state.identifierRanges.totalDoc,
		queryDocCount: state.identifierRanges.queryDocCount
	});
}
