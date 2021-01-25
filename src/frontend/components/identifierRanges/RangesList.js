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
	Breadcrumbs,
	Button,
	Typography
} from '@material-ui/core';

import ModalLayout from '../ModalLayout';
import * as actions from '../../store/actions';
import Spinner from '../Spinner';
import TableComponent from '../TableComponent';
import {commonStyles} from '../../styles/app';
import CreateRange from './CreateRange';
import Identifier from './Identifier';

export default connect(mapStateToProps, actions)(props => {
	const {fetchIDRList, rangesList, userInfo, loading, offset, queryDocCount} = props;
	const intl = useIntl();
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const classes = commonStyles();
	const [inputVal, setInputVal] = useState('');
	const [page, setPage] = React.useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [updateComponent] = useState(false);
	const [rangeType, setRangeType] = useState('range');
	const [rangeId, setRangeId] = useState('');
	const [subRangeId, setSubRangeId] = useState('');
	const [modal, setModal] = useState(false);
	const [identifierModal, setIdentifierModal] = useState(false);
	const [identifierId, setIdentifierId] = useState(null);
	const [activeCheck, setActiveCheck] = useState({
		checked: false
	});

	const [rowSelectedId, setRowSelectedId] = useState(null);

	useEffect(() => {
		fetchIDRList({searchText: inputVal, token: cookie[COOKIE_NAME], offset: lastCursor, activeCheck: activeCheck, rangeType});
	}, [updateComponent, activeCheck, cookie, fetchIDRList, inputVal, lastCursor, rangeType]);

	const handleTableRowClick = id => {
		setRowSelectedId(id);
		if (rangeType === 'range') {
			setRangeType('subRange');
			setRangeId(id);
			setSubRangeId('');
			setInputVal(id);
			setIdentifierId(null);
		}

		if (rangeType === 'subRange') {
			setRangeType('isbnIsmnBatch');
			setSubRangeId(id);
			setIdentifierId(null);
			setInputVal(id);
		}

		if (rangeType === 'isbnIsmnBatch') {
			setRangeType('identifier');
			setIdentifierId(null);
			setInputVal(id);
		}

		if (rangeType === 'identifier') {
			setIdentifierModal(true);
			setIdentifierId(id);
		}

		setPage(1);
		setLastCursor(null);
	};

	const handleChange = name => event => {
		setActiveCheck({...activeCheck, [name]: event.target.checked});
	};

	const handleOnClickBreadCrumbsRange = () => {
		setRangeType('range');
		setInputVal('');
	};

	const handleOnClickBreadCrumbsSubRange = () => {
		setRangeType('subRange');
		setInputVal(rangeId);
	};

	const handleOnClickBreadCrumbsIsbnIsmnBatch = () => {
		setRangeType('isbnIsmnBatch');
		setInputVal(subRangeId);
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

			if (rangeType === 'subRange') {
				array.unshift('publisherIdentifier', 'category', 'rangeStart', 'rangeEnd', 'free', 'taken', 'canceled', 'deleted', 'next', 'active', 'isClosed');
			}

			if (rangeType === 'isbnIsmnBatch') {
				array.unshift('identifierType', 'identifierCount', 'identifierCanceledCount', 'identifierDeletedCount', 'publisherId', 'publicationId', 'publisherIdentifierRangeId');
			}

			if (rangeType === 'identifier') {
				array.unshift('identifier', 'identifierBatchId', 'publisherIdentifierRangeId', 'publicationType');
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
		if (rangeType === 'subRange') {
			return Object.entries(item)
				.filter(([key]) => key === 'isbnIsmnRangeId' === false)
				.filter(([key]) => key === 'publisherId' === false)
				.reduce((acc, [
					key,
					value
				]) => ({...acc, [key]: formatDate(key, value)}), {});
		}

		if (rangeType === 'identifier') {
			return Object.entries(item)
				.reduce((acc, [
					key,
					value
				]) => ({...acc, [key]: formatDate(key, value)}), {});
		}

		return item.created === undefined ?
			{...item} :
			{
				...item,
				created: moment(item.created.replace('Z', ''), moment.defaultFormat).format('L')
			};
		function formatDate(key, value) {
			if (key === 'created') {
				return moment(value, moment.defaultFormat).format('L');
			}

			return value;
		}
	}

	const component = (
		<Grid item xs={12} className={classes.listSearch}>
			{(rangeType !== 'range') &&
				<Breadcrumbs>
					<Button variant="text" onClick={handleOnClickBreadCrumbsRange}>
						<FormattedMessage id="rangesList.breadCrumbs.label.ranges"/>
					</Button>
					{(rangeType === 'isbnIsmnBatch' || rangeType === 'identifier') &&
						<Button variant="text" onClick={handleOnClickBreadCrumbsSubRange}>
							<FormattedMessage id="rangesList.breadCrumbs.label.subrange"/>
						</Button>}
					{rangeType === 'identifier' &&
						<Button variant="text" onClick={handleOnClickBreadCrumbsIsbnIsmnBatch}>
							<FormattedMessage id="rangesList.breadCrumbs.label.isbnIsmnBatch"/>
						</Button>}
					<Typography>{rowSelectedId}</Typography>
				</Breadcrumbs>}
			<Typography variant="h5">
				<FormattedMessage id={`rangesList.title.${rangeType}`}/>
			</Typography>
			{/* <SearchComponent searchFunction={fetchIDRList} setSearchInputVal={setSearchInputVal}/> */}
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
			<Grid>
				{
					userInfo.role === 'admin' &&
						(
							<ModalLayout
								form
								isTableRow
								modal={modal}
								setModal={setModal}
								color="primary"
								title={intl.formatMessage({id: 'app.modal.title.identifierRangesIsbn'})}
								label={intl.formatMessage({id: 'app.modal.title.identifierRangesIsbn'})}
								name="rangeCreation"
								variant="outlined"
							>
								<CreateRange {...props}/>
							</ModalLayout>
						)
				}
			</Grid>
			{ identifierModal && <Identifier id={identifierId} setIdentifierId={setIdentifierId} modal={identifierModal} setIdentifierModal={setIdentifierModal} {...props}/> }

			{data}
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
		rangesList: state.identifierRanges.rangesList,
		range: state.identifierRanges.range,
		offset: state.identifierRanges.offset,
		totalDoc: state.identifierRanges.totalDoc,
		queryDocCount: state.identifierRanges.queryDocCount
	});
}
