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
import EditIcon from '@material-ui/icons/Edit';
import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';
import {useIntl, FormattedMessage} from 'react-intl';

import {commonStyles} from '../../../styles/app';
import * as actions from '../../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import Spinner from '../../Spinner';
import ListComponent from '../../ListComponent';
import CustomColor from '../../../styles/app';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publicationRequestIsbnIsmn',
	validate,
	enableReinitialize: true
})(props => {
	const {
		match,
		loading,
		userInfo,
		fetchPublicationIsbnIsmnRequest,
		publicationIsbnIsmnRequest,
		updatePublicationIsbnIsmnRequest,
		setIsUpdating,
		handleSubmit
	} = props;
	const {id} = match.params;
	const classes = commonStyles();
	const intl = useIntl();
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [buttonState, setButtonState] = useState('');
	const [reject, setReject] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [rejectReason, setRejectReason] = useState('');

	useEffect(() => {
		if (id !== null) {
			fetchPublicationIsbnIsmnRequest(id, cookie[COOKIE_NAME]);
		}
	}, [cookie, fetchPublicationIsbnIsmnRequest, id, buttonState, isEdit]);

	function handleRejectClick() {
		setReject(!reject);
	}

	function handleEditClick() {
		setIsEdit(true);
	}

	function handleCancel() {
		setIsEdit(false);
	}

	function handleRejectReason(e) {
		setRejectReason(e.target.value);
	}

	function handleRejectSubmit() {
		const newPublicationIsbnIsmnRequest = {
			...publicationIsbnIsmnRequest,
			state: 'rejected',
			rejectionReason: rejectReason
		};
		delete newPublicationIsbnIsmnRequest._id;
		updatePublicationIsbnIsmnRequest(publicationIsbnIsmnRequest._id, newPublicationIsbnIsmnRequest, cookie[COOKIE_NAME]);
		setReject(!reject);
		setButtonState(publicationIsbnIsmnRequest.state);
	}

	function handlePublicationRequestUpdate(values) {
		const newPublicationIsbnIsmnRequest = {
			...values,
			state: 'new',
			backgroundProcessingState: 'inProgress'
		};
		updatePublicationIsbnIsmnRequest(publicationIsbnIsmnRequest._id, newPublicationIsbnIsmnRequest, cookie[COOKIE_NAME]);
		setIsEdit(false);
		setButtonState(publicationIsbnIsmnRequest.state);
	}

	function handleAccept() {
		const newPublicationIsbnIsmnRequest = {
			...publicationIsbnIsmnRequest,
			state: 'accepted'
		};
		delete newPublicationIsbnIsmnRequest._id;
		updatePublicationIsbnIsmnRequest(publicationIsbnIsmnRequest._id, newPublicationIsbnIsmnRequest, cookie[COOKIE_NAME]);
		setButtonState(publicationIsbnIsmnRequest.state);
		setIsUpdating(true);
	}

	function isEditable(key) {
		const nonEditableFields = userInfo.role === 'admin' ?
			['lastUpdated', '_id', 'associatedRange', 'identifier', 'metadataReference', 'request', 'associatedRange', 'type', 'format'] :
			(userInfo.role === 'publisher-admin' ?
				['lastUpdated', '_id', 'associatedRange', 'identifier', 'metadataReference', 'request', 'associatedRange', 'type', 'format'] :
				[]);

		return isEdit && !nonEditableFields.includes(key);
	}

	function formatValueforAssociatedRange(value) {
		return value.map(item => item.subRange);
	}

	function renderButton(state, bgState) {
		switch (state) {
			case 'new':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button disabled={state === 'new' && bgState !== 'processed'} variant="outlined" color="primary" onClick={handleAccept}>
							<FormattedMessage id="publicationRequestRender.button.label.accept"/>
						</Button>
						<Button variant="outlined" style={{color: 'red'}} onClick={handleRejectClick}>
							<FormattedMessage id="publicationRequestRender.button.label.reject"/>
						</Button>
					</ButtonGroup>
				);
			case 'accepted':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button variant="contained" color="primary" size="small" style={{cursor: 'not-allowed'}}>
							<FormattedMessage id="publicationRequestRender.button.label.accepted"/>
						</Button>
					</ButtonGroup>
				);
			case 'rejected':
				return (
					<ButtonGroup color="error" aria-label="outlined primary button group">
						<Button variant="contained" style={CustomColor.palette.red} size="small">
							<FormattedMessage id="publicationRequestRender.button.label.rejected"/>
						</Button>
					</ButtonGroup>
				);
			case 'inProgress':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button disabled variant="outlined" color="primary">
							<FormattedMessage id="publicationRequestRender.button.label.accept"/>
						</Button>
						<Button variant="outlined" style={{color: 'red'}} onClick={handleRejectClick}>
							<FormattedMessage id="publicationRequestRender.button.label.reject"/>
						</Button>
					</ButtonGroup>
				);
			default:
				return null;
		}
	}

	const {_id, state, ...formattedPublicationIsbnIsmnRequest} = publicationIsbnIsmnRequest;

	let publicationIsbnIsmnRequestDetail;
	if (formattedPublicationIsbnIsmnRequest === undefined || loading) {
		publicationIsbnIsmnRequestDetail = <Spinner/>;
	} else {
		publicationIsbnIsmnRequestDetail = (
			<>
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Grid item xs={12}>
							<Typography variant="h6">
								Basic Informations
							</Typography>
							<hr/>
							<ListComponent edit={isEdit && isEditable} fieldName="title" label={intl.formatMessage({id: 'listComponent.title'})} value={publicationIsbnIsmnRequest.title ? publicationIsbnIsmnRequest.title : ''}/>
							<ListComponent edit={isEdit && isEditable} fieldName="subtitle" label={intl.formatMessage({id: 'listComponent.subtitle'})} value={publicationIsbnIsmnRequest.subTitle ? publicationIsbnIsmnRequest.subTitle : ''}/>
							<ListComponent edit={isEdit && isEditable} fieldName="language" label={intl.formatMessage({id: 'listComponent.language'})} value={publicationIsbnIsmnRequest.language ? publicationIsbnIsmnRequest.language : ''}/>
							<ListComponent edit={isEdit && isEditable} fieldName="publicationTime" label={intl.formatMessage({id: 'listComponent.publicationTime'})} value={publicationIsbnIsmnRequest.publicationTime ? publicationIsbnIsmnRequest.publicationTime : ''}/>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h6">
								Publisher Basic Informations
							</Typography>
							<hr/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisher[name]"
								label={intl.formatMessage({id: 'listComponent.name'})}
								value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.name ? publicationIsbnIsmnRequest.publisher.name : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisher[postalAddress][address]"
								label={intl.formatMessage({id: 'listComponent.address'})}
								value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.postalAddress && publicationIsbnIsmnRequest.publisher.postalAddress ?
									publicationIsbnIsmnRequest.publisher.postalAddress.address && publicationIsbnIsmnRequest.publisher.postalAddress.address :
									(publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.address ?
										publicationIsbnIsmnRequest.publisher.address :
										'')}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisher[postalAddress][city]"
								label={intl.formatMessage({id: 'listComponent.city'})}
								value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.postalAddress && publicationIsbnIsmnRequest.publisher.postalAddress ?
									publicationIsbnIsmnRequest.publisher.postalAddress.city && publicationIsbnIsmnRequest.publisher.postalAddress.city :
									(publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.city ?
										publicationIsbnIsmnRequest.publisher.city :
										'')}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisher[postalAddress][zip]"
								label={intl.formatMessage({id: 'listComponent.zip'})}
								value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.postalAddress && publicationIsbnIsmnRequest.publisher.postalAddress ?
									publicationIsbnIsmnRequest.publisher.postalAddress.zip && publicationIsbnIsmnRequest.publisher.postalAddress.zip :
									(publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.zip ?
										publicationIsbnIsmnRequest.publisher.zip :
										'')}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisher[phone]"
								label={intl.formatMessage({id: 'listComponent.phone'})}
								value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.phone ? publicationIsbnIsmnRequest.publisher.phone : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisher[givenName]"
								label={intl.formatMessage({id: 'listComponent.givenName'})}
								value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.givenName ? publicationIsbnIsmnRequest.publisher.givenName : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisher[familyName]"
								label={intl.formatMessage({id: 'listComponent.familyName'})}
								value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.familyName ? publicationIsbnIsmnRequest.publisher.familyName : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisher[email]"
								label={intl.formatMessage({id: 'listComponent.email'})}
								value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.email ? publicationIsbnIsmnRequest.publisher.email : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisher[language]"
								label={intl.formatMessage({id: 'listComponent.language'})}
								value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.language ? publicationIsbnIsmnRequest.publisher.language : ''}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Publisher Publishing Activities
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[publicationDetails][frequency][currentYear]"
							label={intl.formatMessage({id: 'listComponent.currentYear'})}
							value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.publicationDetails && publicationIsbnIsmnRequest.publisher.publicationDetails.frequency &&
								publicationIsbnIsmnRequest.publisher.publicationDetails.frequency.currentYear ? publicationIsbnIsmnRequest.publisher.publicationDetails.frequency.currentYear : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[publicationDetails][frequency][nextYear]"
							label={intl.formatMessage({id: 'listComponent.nextYear'})}
							value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.publicationDetails && publicationIsbnIsmnRequest.publisher.publicationDetails.frequency &&
								publicationIsbnIsmnRequest.publisher.publicationDetails.frequency.nextYear ? publicationIsbnIsmnRequest.publisher.publicationDetails.frequency.nextYear : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[publicationDetails][previouslyPublished]"
							label={intl.formatMessage({id: 'listComponent.previouslyPublished'})}
							value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.publicationDetails && publicationIsbnIsmnRequest.publisher.publicationDetails.previouslyPublished ?
								publicationIsbnIsmnRequest.publisher.publicationDetails.frequency.previouslyPublished : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[publicationDetails][publishingActivities]"
							label={intl.formatMessage({id: 'listComponent.publishingActivities'})}
							value={publicationIsbnIsmnRequest.publisher && publicationIsbnIsmnRequest.publisher.publicationDetails && publicationIsbnIsmnRequest.publisher.publicationDetails.frequency.publishingActivities ?
								publicationIsbnIsmnRequest.publisher.publicationDetails.frequency.publishingActivities : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Author Details
						</Typography>
						<hr/>
						{publicationIsbnIsmnRequest.authors && publicationIsbnIsmnRequest.authors.map((item, index) => (
							<div key={`${item.givenName}${Math.random()}`}>
								<ListComponent
									edit={isEdit && isEditable} fieldName={`authors[${index}][givenName]`}
									label={intl.formatMessage({id: 'listComponent.givenName'})}
									value={item.givenName ? item.givenName : ''}
								/>
								<ListComponent
									edit={isEdit && isEditable} fieldName={`authors[${index}][familyName]`}
									label={intl.formatMessage({id: 'listComponent.familyName'})}
									value={item.familyName ? item.familyName : ''}
								/>
								<ListComponent
									edit={isEdit && isEditable} fieldName={`authors[${index}][role]`}
									label={intl.formatMessage({id: 'listComponent.role'})}
									value={item.role ? item.role : ''}
								/>
							</div>
						))}
					</Grid>
				</Grid>
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h6">
							Publication Details
						</Typography>
						<hr/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.isbnClassification'})} value={publicationIsbnIsmnRequest.isbnClassification ? publicationIsbnIsmnRequest.isbnClassification : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.publicationType'})} value={publicationIsbnIsmnRequest.publicationType ? publicationIsbnIsmnRequest.publicationType : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.isPublic'})} value={publicationIsbnIsmnRequest.isPublic ? publicationIsbnIsmnRequest.isPublic : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.type'})} value={publicationIsbnIsmnRequest.type ? publicationIsbnIsmnRequest.type : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.identifier'})} value={publicationIsbnIsmnRequest.identifier ? publicationIsbnIsmnRequest.identifier : ''}/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Series Details
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[volume]"
							label={intl.formatMessage({id: 'listComponent.volume'})}
							value={publicationIsbnIsmnRequest.seriesDetails ?
								(publicationIsbnIsmnRequest.seriesDetails.volume ?
									publicationIsbnIsmnRequest.seriesDetails.volume :
									''
								) :	''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[title]"
							label={intl.formatMessage({id: 'listComponent.title'})}
							value={publicationIsbnIsmnRequest.seriesDetails ?
								(publicationIsbnIsmnRequest.seriesDetails.title ?
									publicationIsbnIsmnRequest.seriesDetails.title :
									''
								) :	''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[identifier]"
							label={intl.formatMessage({id: 'listComponent.identifier'})}
							value={publicationIsbnIsmnRequest.seriesDetails ?
								(publicationIsbnIsmnRequest.seriesDetails.identifier ?
									publicationIsbnIsmnRequest.seriesDetails.identifier :
									''
								) :	''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Format Details
						</Typography>
						<hr/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.selectFormat'})}
							value={publicationIsbnIsmnRequest.formatDetails ?
								(publicationIsbnIsmnRequest.formatDetails.format ?
									publicationIsbnIsmnRequest.formatDetails.format :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.fileFormat'})}
							value={publicationIsbnIsmnRequest.formatDetails ?
								(publicationIsbnIsmnRequest.formatDetails.fileFormat ?
									publicationIsbnIsmnRequest.formatDetails.fileFormat :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.printFormat'})}
							value={publicationIsbnIsmnRequest.formatDetails ?
								(publicationIsbnIsmnRequest.formatDetails.printFormat ?
									publicationIsbnIsmnRequest.formatDetails.printFormat :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="formatDetails[manufacturer]"
							label={intl.formatMessage({id: 'listComponent.manufacturer'})}
							value={publicationIsbnIsmnRequest.formatDetails ?
								(publicationIsbnIsmnRequest.formatDetails.manufacturer ?
									publicationIsbnIsmnRequest.formatDetails.manufacturer :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="formatDetails[city]"
							label={intl.formatMessage({id: 'listComponent.city'})}
							value={publicationIsbnIsmnRequest.formatDetails ?
								(publicationIsbnIsmnRequest.formatDetails.city ?
									publicationIsbnIsmnRequest.formatDetails.city :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="formatDetails[run]"
							label={intl.formatMessage({id: 'listComponent.run'})}
							value={publicationIsbnIsmnRequest.formatDetails ?
								(publicationIsbnIsmnRequest.formatDetails.run ?
									publicationIsbnIsmnRequest.formatDetails.run :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="formatDetails[edition]"
							label={intl.formatMessage({id: 'listComponent.edition'})}
							value={publicationIsbnIsmnRequest.formatDetails ?
								(publicationIsbnIsmnRequest.formatDetails.edition ?
									publicationIsbnIsmnRequest.formatDetails.edition :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Identifier
						</Typography>
						<hr/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.id'})} value={publicationIsbnIsmnRequest.identifier && publicationIsbnIsmnRequest.identifier.id ? publicationIsbnIsmnRequest.identifier.id : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.type'})} value={publicationIsbnIsmnRequest.identifier && publicationIsbnIsmnRequest.identifier.type ? publicationIsbnIsmnRequest.identifier.type : ''}/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Other References
						</Typography>
						<hr/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.state'})} value={publicationIsbnIsmnRequest.state ? publicationIsbnIsmnRequest.state : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.creator'})} value={publicationIsbnIsmnRequest.creator ? publicationIsbnIsmnRequest.creator : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.associatedRange'})} value={publicationIsbnIsmnRequest.associatedRange ? formatValueforAssociatedRange(publicationIsbnIsmnRequest.associatedRange) : ''}/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.lastUpdated'})}
							value={publicationIsbnIsmnRequest.lastUpdated ?
								(publicationIsbnIsmnRequest.lastUpdated.timestamp ?
									publicationIsbnIsmnRequest.lastUpdated.timestamp :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.lastUpdatedBy'})}
							value={publicationIsbnIsmnRequest.lastUpdated ?
								(publicationIsbnIsmnRequest.lastUpdated.user ?
									publicationIsbnIsmnRequest.lastUpdated.user :
									''
								) : ''}
						/>
					</Grid>
				</Grid>
				{/* {typeof formattedPublicationIsbnIsmnRequest.publisher === 'string' ?
					<>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(formattedPublicationIsbnIsmnRequest).map(key => {
										return typeof formattedPublicationIsbnIsmnRequest[key] === 'string' ?
											(
												<ListComponent label={intl.formatMessage({id: `publicationRequest.label.${key}`})} value={formattedPublicationIsbnIsmnRequest[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(formattedPublicationIsbnIsmnRequest).map(key => {
										return typeof formattedPublicationIsbnIsmnRequest[key] === 'object' ?
											(
												<ListComponent label={intl.formatMessage({id: `publicationRequest.label.${key}`})} value={formattedPublicationIsbnIsmnRequest[key]}/>
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
									Object.keys(withoutPublisher).map(key => {
										return <ListComponent key={key} label={intl.formatMessage({id: `publicationRequest.label.${key}`})} value={withoutPublisher[key]}/>;
									})
								}
							</List>
						</Grid>
						<Grid item xs={12} md={6}>
							<ExpansionPanel>
								<ExpansionPanelSummary
									expandIcon={<ExpandMoreIcon/>}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									<FormattedMessage id="publicationRequest.label.publisherDetails"/>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<List>
										{
											Object.keys(formatOnlyPublisher).map(key => {
												return <ListComponent key={key} label={intl.formatMessage({id: `publisherRender.label.${key}`})} value={formatOnlyPublisher[key]}/>;
											})
										}
									</List>
								</ExpansionPanelDetails>
							</ExpansionPanel>

						</Grid>
					</>} */}
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
								<Button variant="contained" color="primary" onClick={handleSubmit(handlePublicationRequestUpdate)}>
									<FormattedMessage id="form.button.label.update"/>
								</Button>
							</div>
							<Grid container item spacing={3} className={classes.listItemSpinner}>
								{publicationIsbnIsmnRequestDetail}
							</Grid>
						</form>
					</div> :
					<Grid container className={classes.listItem}>
						<div className={classes.btnContainer}>
							{reject ?
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
									{renderButton(publicationIsbnIsmnRequest.state, publicationIsbnIsmnRequest.backgroundProcessingState)}
								</Grid>}
							<Fab
								color="primary"
								size="small"
								title={intl.formatMessage({id: 'publication.isbnismn.edit.label'})}
								onClick={handleEditClick}
							>
								<EditIcon/>
							</Fab>
						</div>
						<Grid container item spacing={3} className={classes.listItemSpinner}>
							{publicationIsbnIsmnRequestDetail}
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
		initialValues: state.publication.publicationIsbnIsmnRequest,
		publicationIsbnIsmnRequest: state.publication.publicationIsbnIsmnRequest,
		loading: state.publication.loading,
		isAuthenticated: state.login.isAuthenticated,
		userInfo: state.login.userInfo,
		rangesList: state.identifierRanges.rangesList
	});
}
