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
import Select from 'react-select/creatable';
import moment from 'moment';
import {FormattedMessage, useIntl} from 'react-intl';
import {
	Grid,
	List,
	FormControlLabel,
	Checkbox,
	Typography,
	FormControl,
	InputLabel
} from '@material-ui/core';

import * as actions from '../../../store/actions';
import Spinner from '../../Spinner';
import TableComponent from '../../TableComponent';
import {commonStyles} from '../../../styles/app';
import AlertDialogs from '../../AlertDialogs';
import ListComponent from '../../ListComponent';

export default connect(mapStateToProps, actions)(props => {
	const {
		fetchIDRList,
		rangesList,
		rangeLoading,
		offset,
		queryDocCount,
		rangeType,
		setSubRangeId,
		setPublisherId,
		isbnIsmn,
		publisherOption,
		fetchPublisher,
		fetchedPublisher,
		publisherLoading,
		handleRange,
		next,
		setNext
	} = props;
	const intl = useIntl();
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const classes = commonStyles();
	const [page, setPage] = React.useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [updateComponent] = useState(false);
	const [activeCheck, setActiveCheck] = useState({
		checked: false
	});

	const [rowSelectedId, setRowSelectedId] = useState(null);
	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState(null);
	const [confirmation, setConfirmation] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [selectedPublisher, setSelectedPublisher] = useState(null);
	const [publisher, setPublisher] = useState(null);
	const [renderingPublisherProperties, setRenderingPublisherProperties] = useState(false);

	useEffect(() => {
		setPublisher(isbnIsmn.publisher);
	}, [isbnIsmn.publisher]);

	useEffect(() => {
		fetchIDRList({searchText: isbnIsmn.publisher, token: cookie[COOKIE_NAME], offset: lastCursor, activeCheck: activeCheck, rangeType});
	}, [updateComponent, isbnIsmn.publisher, fetchIDRList, cookie, lastCursor, activeCheck, rangeType]);

	useEffect(() => {
		if (next && fetchedPublisher !== undefined) {
			fetchIDRList({searchText: fetchedPublisher._id, token: cookie[COOKIE_NAME], offset: lastCursor, activeCheck: activeCheck, rangeType});
		}
	}, [updateComponent, isbnIsmn.publisher, fetchIDRList, cookie, lastCursor, activeCheck, rangeType, fetchedPublisher, next]);

	useEffect(() => {
		if (confirmation && selectedId !== null) {
			setRowSelectedId(selectedId);
			if (rangeType === 'subRange') {
				setSubRangeId(selectedId);
				if (selectedPublisher === null) {
					setPublisherId(publisher[0].id);
				} else {
					setPublisherId(selectedPublisher.value);
				}

				handleRange();
			}
		}
	}, [confirmation, handleRange, rangeType, publisher, selectedId, selectedPublisher, setPublisherId, setSubRangeId]);

	useEffect(() => {
		if (selectedPublisher !== null) {
			fetchPublisher(selectedPublisher.value, cookie[COOKIE_NAME]);
			setRenderingPublisherProperties(true);
			setNext(true);
		}
	}, [cookie, fetchPublisher, selectedPublisher, setNext, setRenderingPublisherProperties]);

	useEffect(() => {
		setRenderingPublisherProperties(next);
	}, [next]);

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
		const headers = getHeaders(rangeType);
		function getHeaders(rangeType) {
			const array = [
				'created',
				'createdBy'
			];
			if (rangeType === 'subRange') {
				array.unshift('publisherIdentifier', 'category', 'rangeStart', 'rangeEnd', 'free', 'taken', 'canceled', 'deleted', 'next', 'active', 'isClosed');
			}

			return array;
		}

		return headers.reduce((acc, k) => {
			acc.push({id: `${k}`, label: intl.formatMessage({id: `ranges.${k}`})});
			return acc;
		}, []);
	}

	let data;
	if (rangesList === undefined || rangeLoading || publisherLoading) {
		data = <Spinner/>;
	} else if (rangesList.length === 0 || renderingPublisherProperties) {
		data =
			(
				<FormControl className={classes.formControl}>
					<InputLabel id="select-publisher">Please select a Publisher</InputLabel>
					<Select
						isSearchable
						isClearable
						name="select-publisher"
						value={selectedPublisher !== null && selectedPublisher}
						options={publisherOption}
						onChange={value => {
							setRenderingPublisherProperties(false);
							setSelectedPublisher(value);
							setRenderingPublisherProperties(true);
						}}
					/>
					{
						renderingPublisherProperties &&
							<Grid item xs={12} md={12} style={{border: '1px solid', padding: 10}}>
								<List>
									{
										Object.keys(fetchedPublisher).map(key => {
											const {_id, language, request, metadataDelivery, isbnRange, ismnRange, ...formattedFetchedPublisher} = fetchedPublisher;
											return typeof formattedFetchedPublisher[key] === 'string' ?
												(
													<ListComponent label={intl.formatMessage({id: `publisherRender.label.${key}`})} value={formattedFetchedPublisher[key]}/>
												) :
												null;
										})
									}
								</List>
							</Grid>
					}
				</FormControl>
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
		return Object.entries(item)
			.filter(([key]) => key === 'isbnIsmnRangeId' === false)
			.filter(([key]) => key === 'publisherId' === false)
			.reduce((acc, [
				key,
				value
			]) => ({...acc, [key]: formatDate(key, value)}), {});

		function formatDate(key, value) {
			if (key === 'created') {
				return moment(value, moment.defaultFormat).format('L');
			}

			return value;
		}
	}

	const component = (
		<Grid>
			<Grid item xs={12} className={classes.listComponent}>
				<Typography variant="h5">
					<FormattedMessage id={`rangesList.title.${rangeType}`}/>
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
					{publisherLoading}
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
		rangesList: state.identifierRanges.rangesList,
		offset: state.identifierRanges.offset,
		totalDoc: state.identifierRanges.totalDoc,
		queryDocCount: state.identifierRanges.queryDocCount,
		publisherLoading: state.publisher.loading,
		fetchedPublisher: state.publisher.publisher
	});
}
