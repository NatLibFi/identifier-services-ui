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
	Grid,
	Fab,
	ButtonGroup,
	Button,
	TextareaAutosize,
	Typography
} from '@material-ui/core';
import {reduxForm} from 'redux-form';
import EditIcon from '@material-ui/icons/Edit';
import {useCookies} from 'react-cookie';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import {FormattedMessage, useIntl} from 'react-intl';

import {commonStyles} from '../../styles/app';
import * as actions from '../../store/actions';
import Spinner from '../Spinner';
import ListComponent from '../ListComponent';
import CustomColor from '../../styles/app';
import {classificationCodes} from '../form/publisherRegistrationForm/formFieldVariable';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publisherRequestUpdateForm',
	validate,
	enableReinitialize: true
})(props => {
	const {
		match,
		loading,
		handleSubmit,
		isAuthenticated,
		userInfo,
		fetchPublisherRequest,
		publisherRequest,
		updatePublisherRequest
	} = props;
	const {id} = match.params;
	const classes = commonStyles();
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const intl = useIntl();
	const [buttonState, setButtonState] = useState('');
	const [reject, setReject] = useState(false);
	const [rejectReason, setRejectReason] = useState('');
	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		if (id !== null) {
			fetchPublisherRequest(id, cookie[COOKIE_NAME]);
		}
	}, [cookie, fetchPublisherRequest, id, buttonState, isEdit]);
	function handleRejectClick() {
		setReject(!reject);
	}

	function handleRejectReason(e) {
		setRejectReason(e.target.value);
	}

	function handleRejectSubmit() {
		const newPublisherRequest = {
			...publisherRequest,
			state: 'rejected',
			rejectionReason: rejectReason
		};
		delete newPublisherRequest._id;
		updatePublisherRequest(publisherRequest._id, newPublisherRequest, cookie[COOKIE_NAME]);
		setReject(!reject);
		setButtonState(publisherRequest.state);
	}

	function handlePublisherUpdate(values) {
		const {alias, _id, ...newPublisherRequest} = {
			...values,
			classification: values.classification.map(item => item.value.toString()),
			state: 'new',
			backgroundProcessingState: 'inProgress'
		};
		updatePublisherRequest(publisherRequest._id, newPublisherRequest, cookie[COOKIE_NAME]);
		setIsEdit(false);
	}

	function handleAccept() {
		const newPublisherRequest = {
			...publisherRequest,
			state: 'accepted'
		};
		delete newPublisherRequest._id;
		updatePublisherRequest(publisherRequest._id, newPublisherRequest, cookie[COOKIE_NAME]);
		setButtonState(publisherRequest.state);
	}

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	function isEditable(key) {
		const nonEditableFields = userInfo.role === 'admin' ?
			['lastUpdated', '_id', 'associatedRange', 'identifier', 'metadataReference', 'request', 'associatedRange', 'type', 'format', 'createdResource'] :
			(userInfo.role === 'publisher-admin' ?
				['lastUpdated', '_id', 'associatedRange', 'identifier', 'metadataReference', 'request', 'associatedRange', 'type', 'format', 'createdResource', 'state', 'backgroundProcessingState'] :
				[]);

		return isEdit && !nonEditableFields.includes(key);
	}

	function renderButton(state) {
		switch (state) {
			case 'new':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button disabled={publisherRequest.backgroundProcessingState !== 'processed'} variant="outlined" color="primary" onClick={handleAccept}>Accept</Button>
						<Button variant="outlined" style={{color: 'red'}} onClick={handleRejectClick}>
							<FormattedMessage id="publisherRequest.button.label.reject"/>
						</Button>
					</ButtonGroup>
				);
			case 'accepted':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button variant="contained" color="primary" size="small" style={{cursor: 'not-allowed'}}>
							<FormattedMessage id="publisherRequest.button.label.accepted"/>
						</Button>
					</ButtonGroup>
				);
			case 'rejected':
				return (
					<ButtonGroup color="error" aria-label="outlined primary button group">
						<Button variant="contained" style={CustomColor.palette.red} size="small">
							<FormattedMessage id="publisherRequest.button.label.rejected"/>
						</Button>
					</ButtonGroup>
				);
			case 'inProgress':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button variant="outlined" color="primary" onClick={handleAccept}>
							<FormattedMessage id="publisherRequest.button.label.accept"/>
						</Button>
						<Button variant="outlined" style={{color: 'red'}} onClick={handleRejectClick}>
							<FormattedMessage id="publisherRequest.button.label.reject"/>
						</Button>
					</ButtonGroup>
				);
			default:
				return null;
		}
	}

	const formatPublisherRequest = {...publisherRequest, ...publisherRequest.organizationDetails};
	const {organizationDetails, _id, state, ...formattedPublisherRequest} = formatPublisherRequest;

	let publisherRequestDetail;
	if (formattedPublisherRequest === undefined || loading) {
		publisherRequestDetail = <Spinner/>;
	} else {
		publisherRequestDetail = (
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
								value={formattedPublisherRequest.name ? formattedPublisherRequest.name : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="phone"
								label={intl.formatMessage({id: 'listComponent.phone'})}
								value={formattedPublisherRequest.phone ? formattedPublisherRequest.phone : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisherCategory"
								label={intl.formatMessage({id: 'listComponent.publisherCategory'})}
								value={formattedPublisherRequest.publisherCategory ? formattedPublisherRequest.publisherCategory : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="language"
								label={intl.formatMessage({id: 'listComponent.language'})}
								value={formattedPublisherRequest.language ? formattedPublisherRequest.language : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="email"
								label={intl.formatMessage({id: 'listComponent.email'})}
								value={formattedPublisherRequest.email ? formattedPublisherRequest.email : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="givenName"
								label={intl.formatMessage({id: 'listComponent.givenName'})}
								value={formattedPublisherRequest.givenName ? formattedPublisherRequest.givenName : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="familyName"
								label={intl.formatMessage({id: 'listComponent.familyName'})}
								value={formattedPublisherRequest.familyName ? formattedPublisherRequest.familyName : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisherType"
								label={intl.formatMessage({id: 'listComponent.publisherType'})}
								value={formattedPublisherRequest.publisherType ? formattedPublisherRequest.publisherType : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="creator"
								label={intl.formatMessage({id: 'listComponent.creator'})}
								value={formattedPublisherRequest.creator ? formattedPublisherRequest.creator : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="website"
								label={intl.formatMessage({id: 'listComponent.website'})}
								value={formattedPublisherRequest.website ? formattedPublisherRequest.website : ''}
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
								value={formattedPublisherRequest && formattedPublisherRequest.postalAddress && formattedPublisherRequest.postalAddress.address ?
									formattedPublisherRequest.postalAddress.address : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="postalAddress[city]"
								label={intl.formatMessage({id: 'listComponent.city'})}
								value={formattedPublisherRequest && formattedPublisherRequest.postalAddress && formattedPublisherRequest.postalAddress.city ?
									formattedPublisherRequest.postalAddress.city : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="postalAddress[zip]"
								label={intl.formatMessage({id: 'listComponent.zip'})}
								value={formattedPublisherRequest && formattedPublisherRequest.postalAddress && formattedPublisherRequest.postalAddress.zip ?
									formattedPublisherRequest.postalAddress.zip : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="postalAddress[public]"
								label={intl.formatMessage({id: 'listComponent.public'})}
								value={formattedPublisherRequest && formattedPublisherRequest.postalAddress && formattedPublisherRequest.postalAddress.public ?
									formattedPublisherRequest.postalAddress.public : ''}
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
							value={formattedPublisherRequest && formattedPublisherRequest.affiliateOf && formattedPublisherRequest.affiliateOf.address ?
								formattedPublisherRequest.affiliateOf.address : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[affiliateOf][city]"
							label={intl.formatMessage({id: 'listComponent.city'})}
							value={formattedPublisherRequest && formattedPublisherRequest.affiliateOf && formattedPublisherRequest.affiliateOf.city ?
								formattedPublisherRequest.affiliateOf.city : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[affiliateOf][zip]"
							label={intl.formatMessage({id: 'listComponent.zip'})}
							value={formattedPublisherRequest && formattedPublisherRequest.affiliateOf && formattedPublisherRequest.affiliateOf.zip ?
								formattedPublisherRequest.affiliateOf.zip : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[affiliateOf][name]"
							label={intl.formatMessage({id: 'listComponent.name'})}
							value={formattedPublisherRequest && formattedPublisherRequest.affiliateOf && formattedPublisherRequest.affiliateOf.name ?
								formattedPublisherRequest.affiliateOf.name : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.affiliates"/>
						</Typography>
						<hr/>
						{
							formattedPublisherRequest && formattedPublisherRequest.affiliates && formattedPublisherRequest.affiliates.map(item => (
								<Grid key={`${item.name}${item.address}`} container>
									<ListComponent
										edit={isEdit && isEditable}
										fieldName="organizationDetails[affiliates][address]"
										label={intl.formatMessage({id: 'listComponent.address'})}
										value={item.address ? item.address : ''}
									/>
									<ListComponent
										edit={isEdit && isEditable}
										fieldName="organizationDetails[affiliates][city]"
										label={intl.formatMessage({id: 'listComponent.city'})}
										value={item.city ? item.city : ''}
									/>
									<ListComponent
										edit={isEdit && isEditable}
										fieldName="organizationDetails[affiliates][zip]"
										label={intl.formatMessage({id: 'listComponent.zip'})}
										value={item.zip ? item.zip : ''}
									/>
									<ListComponent
										edit={isEdit && isEditable}
										fieldName="organizationDetails[affiliates][name]"
										label={intl.formatMessage({id: 'listComponent.name'})}
										value={item.name ? item.name : ''}
									/>
								</Grid>

							))
						}
					</Grid>
					<Grid item xs={12}>
						{console.log(formattedPublisherRequest)}
						<Typography variant="h6">
							<FormattedMessage id="listComponent.distributorOf"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributorOf][address]"
							label={intl.formatMessage({id: 'listComponent.address'})}
							value={formattedPublisherRequest && formattedPublisherRequest.distributorOf && formattedPublisherRequest.distributorOf.address ?
								formattedPublisherRequest.distributorOf.address : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributorOf][city]"
							label={intl.formatMessage({id: 'listComponent.city'})}
							value={formattedPublisherRequest && formattedPublisherRequest.distributorOf && formattedPublisherRequest.distributorOf.city ?
								formattedPublisherRequest.distributorOf.city : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributorOf][zip]"
							label={intl.formatMessage({id: 'listComponent.zip'})}
							value={formattedPublisherRequest && formattedPublisherRequest.distributorOf && formattedPublisherRequest.distributorOf.zip ?
								formattedPublisherRequest.distributorOf.zip : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributorOf][name]"
							label={intl.formatMessage({id: 'listComponent.name'})}
							value={formattedPublisherRequest && formattedPublisherRequest.distributorOf && formattedPublisherRequest.distributorOf.name ?
								formattedPublisherRequest.distributorOf.name : ''}
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
							value={formattedPublisherRequest && formattedPublisherRequest.distributor && formattedPublisherRequest.distributor.address ?
								formattedPublisherRequest.distributor.address : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributor][city]"
							label={intl.formatMessage({id: 'listComponent.city'})}
							value={formattedPublisherRequest && formattedPublisherRequest.distributor && formattedPublisherRequest.distributor.city ?
								formattedPublisherRequest.distributor.city : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributor][zip]"
							label={intl.formatMessage({id: 'listComponent.zip'})}
							value={formattedPublisherRequest && formattedPublisherRequest.distributor && formattedPublisherRequest.distributor.zip ?
								formattedPublisherRequest.distributor.zip : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="organizationDetails[distributor][name]"
							label={intl.formatMessage({id: 'listComponent.name'})}
							value={formattedPublisherRequest && formattedPublisherRequest.distributor && formattedPublisherRequest.distributor.name ?
								formattedPublisherRequest.distributor.name : ''}
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
							label={intl.formatMessage({id: 'listComponent.aliases'})}
							value={formattedPublisherRequest.aliases ? formattedPublisherRequest.aliases : []}
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
							value={formattedPublisherRequest && formattedPublisherRequest.publicationDetails && formattedPublisherRequest.publicationDetails.frequency && formattedPublisherRequest.publicationDetails.frequency.currentYear ?
								formattedPublisherRequest.publicationDetails.frequency.currentYear : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publicationDetails[frequency][currentYear]"
							label={intl.formatMessage({id: 'listComponent.nextYear'})}
							value={formattedPublisherRequest && formattedPublisherRequest.publicationDetails && formattedPublisherRequest.publicationDetails.frequency && formattedPublisherRequest.publicationDetails.frequency.nextYear ?
								formattedPublisherRequest.publicationDetails.frequency.nextYear : ''}
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
								label={intl.formatMessage({id: 'listComponent.classification'})}
								value={formattedPublisherRequest.classification && formattedPublisherRequest.classification}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.status"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="state"
							label={intl.formatMessage({id: 'listComponent.state'})}
							value={formattedPublisherRequest.state ? formattedPublisherRequest.state : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="backgroundProcessingState"
							label={intl.formatMessage({id: 'listComponent.backgroundProcessingState'})}
							value={formattedPublisherRequest.backgroundProcessingState ? formattedPublisherRequest.backgroundProcessingState : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="rejectionReason"
							label={intl.formatMessage({id: 'listComponent.rejectionReason'})}
							value={formattedPublisherRequest.rejectionReason ? formattedPublisherRequest.rejectionReason : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="rejectionReason"
							label={intl.formatMessage({id: 'listComponent.createdResource'})}
							value={formattedPublisherRequest.createdResource ? formattedPublisherRequest.createdResource : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.lastUpdated"/>
						</Typography>
						<hr/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.timestamp'})}
							value={formattedPublisherRequest.lastUpdated ?
								(formattedPublisherRequest.lastUpdated.timestamp ?
									formattedPublisherRequest.lastUpdated.timestamp :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.user'})}
							value={formattedPublisherRequest.lastUpdated ?
								(formattedPublisherRequest.lastUpdated.user ?
									formattedPublisherRequest.lastUpdated.user :
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
							value={formattedPublisherRequest.notes ? formattedPublisherRequest.notes : ''}
						/>
					</Grid>
				</Grid>
			</>
		);
	}

	const component = (
		<Grid item xs={12}>
			{
				isEdit ?
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
								{publisherRequestDetail}
							</Grid>
						</form>
					</div> :
					<Grid container className={classes.listItem}>
						<div className={classes.btnContainer}>
							{
								reject ?
									<>
										<Grid item xs={12}>
											<TextareaAutosize
												aria-label="Minimum height"
												rows={8}
												placeholder="Rejection reason here..."
												className={classes.textArea}
												value={rejectReason}
												onChange={handleRejectReason}
											/>
										</Grid>
										<Grid item xs={12}>
											<Button variant="contained" onClick={handleRejectClick}>
												<FormattedMessage id="form.button.label.cancel"/>
											</Button>
											<Button variant="contained" color="primary" onClick={handleRejectSubmit}>
												<FormattedMessage id="form.button.label.submit"/>
											</Button>
										</Grid>
									</> :
									<Grid item xs={12}>
										{renderButton(publisherRequest.state)}
									</Grid>
							}
							{isAuthenticated && userInfo.role === 'admin' &&
								<>
									<Fab
										color="primary"
										size="small"
										title={intl.formatMessage({id: 'user.fab.label.editUser'})}
										onClick={handleEditClick}
									>
										<EditIcon/>
									</Fab>
								</>}
						</div>
						<Grid container spacing={3} className={classes.listItemSpinner}>
							{publisherRequestDetail}
						</Grid>
					</Grid>
			}
		</Grid>
	);
	return {
		...component
	};
}));

function mapStateToProps(state) {
	return ({
		initialValues: formatInitialValues(state.publisher.publisherRequest),
		publisherRequest: state.publisher.publisherRequest,
		loading: state.publisher.loading,
		isAuthenticated: state.login.isAuthenticated,
		userInfo: state.login.userInfo,
		rangleListLoading: state.identifierRanges.rangeListLoading,
		isbnRangeList: state.identifierRanges.isbnList,
		ismnRangeList: state.identifierRanges.ismnList
	});
}

function formatInitialValues(values) {
	if (Object.keys(values).length > 0) {
		const formattedValues = {
			...values,
			classification: values.classification.map(item => {
				return formatClassificationForEditing(Number(item));
			})
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

