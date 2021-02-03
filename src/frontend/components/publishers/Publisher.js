/* eslint-disable complexity */
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
	Typography,
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
import {classificationCodes} from '../form/publisherRegistrationForm/formFieldVariable';

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
		clearFields,
		fetchIDRList,
		isAuthenticated,
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
	}, [cookie, fetchPublisher, id, publisherUpdated, isEdit]);

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
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Grid item xs={12}>
							<Typography variant="h6">
								<FormattedMessage id="listComponent.basicInformations"/>
							</Typography>
							<hr/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="name"
								label={intl.formatMessage({id: 'listComponent.name'})}
								value={formattedPublisherDetail.name ? formattedPublisherDetail.name : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="phone"
								label={intl.formatMessage({id: 'listComponent.phone'})}
								value={formattedPublisherDetail.phone ? formattedPublisherDetail.phone : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisherCategory"
								label={intl.formatMessage({id: 'listComponent.publisherCategory'})}
								value={formattedPublisherDetail.publisherCategory ? formattedPublisherDetail.publisherCategory : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="language"
								label={intl.formatMessage({id: 'listComponent.language'})}
								value={formattedPublisherDetail.language ? formattedPublisherDetail.language : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="email"
								label={intl.formatMessage({id: 'listComponent.email'})}
								value={formattedPublisherDetail.email ? formattedPublisherDetail.email : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="givenName"
								label={intl.formatMessage({id: 'listComponent.givenName'})}
								value={formattedPublisherDetail.givenName ? formattedPublisherDetail.givenName : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="familyName"
								label={intl.formatMessage({id: 'listComponent.familyName'})}
								value={formattedPublisherDetail.familyName ? formattedPublisherDetail.familyName : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisherType"
								label={intl.formatMessage({id: 'listComponent.publisherType'})}
								value={formattedPublisherDetail.publisherType ? formattedPublisherDetail.publisherType : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="creator"
								label={intl.formatMessage({id: 'listComponent.creator'})}
								value={formattedPublisherDetail.creator ? formattedPublisherDetail.creator : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="website"
								label={intl.formatMessage({id: 'listComponent.website'})}
								value={formattedPublisherDetail.website ? formattedPublisherDetail.website : ''}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h6">
								<FormattedMessage id="listComponent.postalAddress"/>
							</Typography>
							<hr/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="postalAddress[address]"
								label={intl.formatMessage({id: 'listComponent.address'})}
								value={formattedPublisherDetail && formattedPublisherDetail.postalAddress && formattedPublisherDetail.postalAddress.address ?
									formattedPublisherDetail.postalAddress.address : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="postalAddress[city]"
								label={intl.formatMessage({id: 'listComponent.city'})}
								value={formattedPublisherDetail && formattedPublisherDetail.postalAddress && formattedPublisherDetail.postalAddress.city ?
									formattedPublisherDetail.postalAddress.city : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="postalAddress[zip]"
								label={intl.formatMessage({id: 'listComponent.zip'})}
								value={formattedPublisherDetail && formattedPublisherDetail.postalAddress && formattedPublisherDetail.postalAddress.zip ?
									formattedPublisherDetail.postalAddress.zip : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="postalAddress[public]"
								label={intl.formatMessage({id: 'listComponent.public'})}
								value={formattedPublisherDetail && formattedPublisherDetail.postalAddress && formattedPublisherDetail.postalAddress.public ?
									formattedPublisherDetail.postalAddress.public : ''}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.affiliateOf"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[affiliateOf][address]"
							label={intl.formatMessage({id: 'listComponent.address'})}
							value={formattedPublisherDetail && formattedPublisherDetail.affiliateOf && formattedPublisherDetail.affiliateOf.address ?
								formattedPublisherDetail.affiliateOf.address : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[affiliateOf][city]"
							label={intl.formatMessage({id: 'listComponent.city'})}
							value={formattedPublisherDetail && formattedPublisherDetail.affiliateOf && formattedPublisherDetail.affiliateOf.city ?
								formattedPublisherDetail.affiliateOf.city : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[affiliateOf][zip]"
							label={intl.formatMessage({id: 'listComponent.zip'})}
							value={formattedPublisherDetail && formattedPublisherDetail.affiliateOf && formattedPublisherDetail.affiliateOf.zip ?
								formattedPublisherDetail.affiliateOf.zip : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[affiliateOf][name]"
							label={intl.formatMessage({id: 'listComponent.name'})}
							value={formattedPublisherDetail && formattedPublisherDetail.affiliateOf && formattedPublisherDetail.affiliateOf.name ?
								formattedPublisherDetail.affiliateOf.name : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.affiliates"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[affiliates]"
							label={intl.formatMessage({id: 'listComponent'})}
							value={formattedPublisherDetail && formattedPublisherDetail.affiliates ? formattedPublisherDetail.affiliates : []}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.distributorOf"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributorOf][address]"
							label={intl.formatMessage({id: 'listComponent.address'})}
							value={formattedPublisherDetail && formattedPublisherDetail.distributorOf && formattedPublisherDetail.distributorOf.address ?
								formattedPublisherDetail.distributorOf.address : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributorOf][city]"
							label={intl.formatMessage({id: 'listComponent.city'})}
							value={formattedPublisherDetail && formattedPublisherDetail.distributorOf && formattedPublisherDetail.distributorOf.city ?
								formattedPublisherDetail.distributorOf.city : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributorOf][zip]"
							label={intl.formatMessage({id: 'listComponent.zip'})}
							value={formattedPublisherDetail && formattedPublisherDetail.distributorOf && formattedPublisherDetail.distributorOf.zip ?
								formattedPublisherDetail.distributorOf.zip : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributorOf][name]"
							label={intl.formatMessage({id: 'listComponent.name'})}
							value={formattedPublisherDetail && formattedPublisherDetail.distributorOf && formattedPublisherDetail.distributorOf.name ?
								formattedPublisherDetail.distributorOf.name : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.distributor"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributor][address]"
							label={intl.formatMessage({id: 'listComponent.address'})}
							value={formattedPublisherDetail && formattedPublisherDetail.distributor && formattedPublisherDetail.distributor.address ?
								formattedPublisherDetail.distributor.address : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributor][city]"
							label={intl.formatMessage({id: 'listComponent.city'})}
							value={formattedPublisherDetail && formattedPublisherDetail.distributor && formattedPublisherDetail.distributor.city ?
								formattedPublisherDetail.distributor.city : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributor][zip]"
							label={intl.formatMessage({id: 'listComponent.zip'})}
							value={formattedPublisherDetail && formattedPublisherDetail.distributor && formattedPublisherDetail.distributor.zip ?
								formattedPublisherDetail.distributor.zip : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributor][name]"
							label={intl.formatMessage({id: 'listComponent.name'})}
							value={formattedPublisherDetail && formattedPublisherDetail.distributor && formattedPublisherDetail.distributor.name ?
								formattedPublisherDetail.distributor.name : ''}
						/>
					</Grid>
				</Grid>
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.aliases"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="aliases"
							clearFields={clearFields}
							label={intl.formatMessage({id: 'listComponent.aliases'})}
							value={formattedPublisherDetail.aliases ? formattedPublisherDetail.aliases : []}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Frequency
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publicationDetails[frequency][currentYear]"
							label={intl.formatMessage({id: 'listComponent.currentYear'})}
							value={formattedPublisherDetail && formattedPublisherDetail.publicationDetails && formattedPublisherDetail.publicationDetails.frequency && formattedPublisherDetail.publicationDetails.frequency.currentYear ?
								formattedPublisherDetail.publicationDetails.frequency.currentYear : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publicationDetails[frequency][currentYear]"
							label={intl.formatMessage({id: 'listComponent.nextYear'})}
							value={formattedPublisherDetail && formattedPublisherDetail.publicationDetails && formattedPublisherDetail.publicationDetails.frequency && formattedPublisherDetail.publicationDetails.frequency.nextYear ?
								formattedPublisherDetail.publicationDetails.frequency.nextYear : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.classification"/>
						</Typography>
						<hr/>
						<Grid container style={{display: 'flex', flexDirection: 'column'}}>
							<ListComponent
								edit={isEdit && isEditable} fieldName="classification"
								clearFields={clearFields}
								label={intl.formatMessage({id: 'listComponent.classification'})}
								value={formattedPublisherDetail.classification ? formattedPublisherDetail.classification : []}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.activity"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="active"
							label={intl.formatMessage({id: 'listComponent.active'})}
							value={formattedPublisherDetail.activity && formattedPublisherDetail.activity.active ? formattedPublisherDetail.activity.active : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="yearInactivated"
							label={intl.formatMessage({id: 'listComponent.yearInactivated'})}
							value={formattedPublisherDetail.activity && formattedPublisherDetail.activity.yearInactivated ? formattedPublisherDetail.activity.yearInactivated : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.lastUpdated"/>
						</Typography>
						<hr/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.timestamp'})}
							value={formattedPublisherDetail.lastUpdated ?
								(formattedPublisherDetail.lastUpdated.timestamp ?
									formattedPublisherDetail.lastUpdated.timestamp :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.user'})}
							value={formattedPublisherDetail.lastUpdated ?
								(formattedPublisherDetail.lastUpdated.user ?
									formattedPublisherDetail.lastUpdated.user :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.notes"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="notes"
							label={intl.formatMessage({id: 'listComponent.notes'})}
							value={formattedPublisherDetail.notes ? formattedPublisherDetail.notes : []}
						/>
					</Grid>
				</Grid>
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
			const {_id, alias, ...updateValues} = values;
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

function formatInitialValues(values) {
	if (Object.keys(values).length > 0) {
		const formattedValues = {
			...values,
			classification: values.classification ? values.classification.map(item => {
				return formatClassificationForEditing(Number(item));
			}) : []
		};

		return formattedValues;
	}

	function formatClassificationForEditing(v) {
		return classificationCodes.reduce((acc, k) => {
			if (k.value === v) {
				acc = k;
				return acc;
			}

			return acc;
		}, {});
	}
}
