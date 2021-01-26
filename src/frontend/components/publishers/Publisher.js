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
import {
	Button,
	Grid,
	List,
	Fab
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';
import {FormattedMessage, useIntl} from 'react-intl';

import {commonStyles} from '../../styles/app';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import Spinner from '../Spinner';
import ListComponent from '../ListComponent';
import SelectRange from './SelectRange';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {formatClassificationDefaultValue} from '../form/publisherRegistrationForm/commons';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publisherUpdateForm',
	validate,
	enableReinitialize: true
})(props => {
	const {
		fetchPublisher,
		fetchIDR,
		updatePublisher,
		match,
		history,
		publisher,
		publisherUpdated,
		loading,
		range,
		createNewRange,
		handleSubmit,
		fetchIDRList,
		isAuthenticated,
		clearFields,
		userInfo} = props;
	const {id} = match.params;
	const classes = commonStyles();
	const intl = useIntl();
	const [isEdit, setIsEdit] = useState(false);
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [assignRange, setAssignRange] = useState(false);
	const [newPublisherRangeId, setNewPublisherRangeId] = useState(null);
	const [enableUpdate, setEnableUpdate] = useState(false);

	const activeCheck = {
		checked: true
	};

	useEffect(() => {
		if (id !== null) {
			fetchPublisher(id, cookie[COOKIE_NAME]);
		}
	}, [cookie, fetchPublisher, id, publisherUpdated]);

	useEffect(() => {
		async function run() {
			if (newPublisherRangeId !== null) {
				// TO DO Check for active only
				const newRange = await createNewRange({id, rangeId: newPublisherRangeId}, cookie[COOKIE_NAME]);
				if (newRange) {
					fetchIDR(newRange, cookie[COOKIE_NAME]);
					setEnableUpdate(true);
				}
			}
		}

		run();
	}, [cookie, createNewRange, fetchIDR, id, newPublisherRangeId]);

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	function isEditable(key) {
		const nonEditableFields = userInfo.role === 'admin' ?
			['lastUpdated', '_id', 'isbnRange', 'ismnRange'] :
			(userInfo.role === 'publisher-admin' ?
				['lastUpdated', '_id', 'request', 'metadataDelivery', 'isbnRange', 'ismnRange'] :
				[]);

		return isEdit && !nonEditableFields.includes(key);
	}

	const {organizationDetails, _id, publisherRangeId, ...formattedPublisherDetail} = {...publisher, ...publisher.organizationDetails, notes: (publisher && publisher.notes) ? publisher.notes.map(item => {
		return {note: Buffer.from(item).toString('base64')};
	}) : ''};
	let publisherDetail;
	if ((Object.keys(publisher).length === 0) || formattedPublisherDetail === undefined || loading) {
		publisherDetail = <Spinner/>;
	} else {
		publisherDetail = (
			<>
				{isEdit ?
					<>
						<Grid item xs={12} md={6}>
							<List>
								{console.log(formattedPublisherDetail)}
								{
									Object.keys(formattedPublisherDetail).map(key => {
										return (formattedPublisherDetail[key] !== undefined && typeof formattedPublisherDetail[key] === 'string') ?
											(
												<ListComponent clearFields={clearFields} edit={isEditable(key)} fieldName={key} label={intl.formatMessage({id: `publisherRender.label.${key}`})} value={formattedPublisherDetail[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(formattedPublisherDetail).map(key => {
										return (formattedPublisherDetail[key] !== undefined && typeof formattedPublisherDetail[key] === 'object') ?
											(
												<ListComponent clearFields={clearFields} edit={isEditable(key)} fieldName={key} label={intl.formatMessage({id: `publisherRender.label.${key}`})} value={formattedPublisherDetail[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
					</> :
					<>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(formattedPublisherDetail).map(key => {
										return typeof formattedPublisherDetail[key] === 'string' ?
											(
												<ListComponent label={intl.formatMessage({id: `publisherRender.label.${key}`})} value={formattedPublisherDetail[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(formattedPublisherDetail).map(key => {
										return typeof formattedPublisherDetail[key] === 'object' ?
											(
												<ListComponent label={intl.formatMessage({id: `publisherRender.label.${key}`})} value={formattedPublisherDetail[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
					</>}
			</>
		);
	}

	const handlePublisherUpdate = values => {
		const token = cookie[COOKIE_NAME];
		if (assignRange) {
			const {_id, publisherRangeId, publisherIdentifier, ...updateValues} = publisher;
			if (Object.keys(range).length > 0) {
				const newPublisher = {
					...updateValues,
					publisherRangeId: publisherRangeId ? [...publisherRangeId, newPublisherRangeId] : [newPublisherRangeId],
					publisherIdentifier: publisherIdentifier ? [...publisherIdentifier, range.publisherIdentifier] : [range.publisherIdentifier]
				};
				updatePublisher(_id, {...newPublisher}, token);
			}
		} else {
			const {_id, ...updateValues} = values;
			const newClassification = values.classification.map(item => item.value.toString());
			updatePublisher(_id, {...updateValues, classification: newClassification}, token);
			setIsEdit(false);
		}

		setIsEdit(false);
		setAssignRange(false);
	};

	function handleBack() {
		setAssignRange(false);
		history.push(`/publishers/${id}`);
	}

	function handleRange() {
		setAssignRange(!assignRange);
		fetchIDRList({searchText: '', token: cookie[COOKIE_NAME], offset: null, activeCheck: activeCheck, rangeType: 'range'});
	}

	const component = (
		<Grid item xs={12}>
			{isEdit ?
				<div className={classes.listItem}>
					<form>
						<div className={classes.btnContainer}>
							<Button onClick={handleCancel}>
								<FormattedMessage id="form.button.label.cancel"/>
							</Button>
							<Button variant="contained" color="primary" onClick={handleSubmit(handlePublisherUpdate)}>
								<FormattedMessage id="form.button.label.update"/>
							</Button>
						</div>
						<Grid container spacing={3} className={classes.listItemSpinner}>
							{publisherDetail}
						</Grid>
					</form>
				</div> :
				<div className={classes.listItem}>
					{assignRange ?
						<>
							<>
								{
									!enableUpdate &&
										<Button
											variant="outlined"
											startIcon={<ArrowBackIosIcon/>}
											onClick={handleBack}
										>
											<FormattedMessage id="form.button.label.back"/>
										</Button>
								}
								<Button disabled={!enableUpdate} variant="outlined" color="primary" onClick={handlePublisherUpdate}>
									<FormattedMessage id="form.button.label.update"/>
								</Button>
							</>
							<SelectRange rangeType="range" setNewPublisherRangeId={setNewPublisherRangeId} setAssignRange={setAssignRange} {...props}/>
						</> :
						<>
							{
								isAuthenticated && userInfo.role === 'admin' &&
									<>
										<Button variant="outlined" color="primary" onClick={handleRange}>
											<FormattedMessage id="publisher.button.label.assignRanges"/>
										</Button>
										<Fab
											color="primary"
											size="small"
											title={intl.formatMessage({id: 'user.fab.label.editUser'})}
											onClick={handleEditClick}
										>
											<EditIcon/>
										</Fab>
									</>
							}
							{
								isAuthenticated && userInfo.role === 'publisher-admin' && // Different condition for publisher-Admin
									<Fab
										color="primary"
										size="small"
										title={intl.formatMessage({id: 'user.fab.label.editUser'})}
										onClick={handleEditClick}
									>
										<EditIcon/>
									</Fab>
							}
							{isAuthenticated && userInfo.role === 'publisher' &&
								<div className={classes.btnContainer}>
									<Fab
										color="primary"
										size="small"
										title="Edit Publisher Detail"
										onClick={handleEditClick}
									>
										<EditIcon/>
									</Fab>
								</div>}
							<Grid container spacing={3} className={classes.listItemSpinner}>
								{publisherDetail}
							</Grid>
						</>}
				</div>}
		</Grid>
	);
	return {
		...component
	};
}));

function mapStateToProps(state) {
	function formatInitialValues(values) {
		return {...values, classification: values.classification && formatClassificationDefaultValue(values.classification)};
	}

	return ({
		publisher: state.publisher.publisher,
		publisherUpdated: state.publisher.publisherUpdated,
		loading: state.publisher.loading,
		initialValues: formatInitialValues(state.publisher.publisher),
		isAuthenticated: state.login.isAuthenticated,
		range: state.identifierRanges.range,
		userInfo: state.login.userInfo
	});
}
