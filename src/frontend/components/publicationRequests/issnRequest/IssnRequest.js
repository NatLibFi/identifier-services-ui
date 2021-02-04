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
	ButtonGroup,
	Button,
	TextareaAutosize,
	Typography,
	Fab
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
	form: 'publicationRequestIssn',
	validate,
	enableReinitialize: true
})(props => {
	const {
		loading,
		userInfo,
		handleSubmit,
		fetchIssnRequest,
		issnRequest,
		updateIssnRequest,
		match,
		setIsUpdating
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
			fetchIssnRequest(id, cookie[COOKIE_NAME]);
		}
	}, [cookie, fetchIssnRequest, buttonState, id]);

	function handleEditClick() {
		setIsEdit(true);
	}

	function handleCancel() {
		setIsEdit(false);
	}

	function handleRejectClick() {
		setReject(!reject);
	}

	function handleRejectReason(e) {
		setRejectReason(e.target.value);
	}

	function handleRejectSubmit() {
		const newIssnRequest = {
			...issnRequest,
			state: 'rejected',
			created: {
				user: userInfo.name.givenName
			},
			rejectionReason: rejectReason
		};
		delete newIssnRequest._id;
		updateIssnRequest(issnRequest._id, newIssnRequest, cookie[COOKIE_NAME]);
		setReject(!reject);
		setButtonState(issnRequest.state);
	}

	function handlePublicationRequestUpdate(values) {
		const newIssnRequest = {
			...values,
			firstYear: Number(values.firstYear),
			lastYear: values.previousPublication && values.previousPublication.lastYear && Number(values.lastYear),
			state: 'new',
			backgroundProcessingState: 'inProgress'
		};
		delete newIssnRequest._id;
		updateIssnRequest(issnRequest._id, newIssnRequest, cookie[COOKIE_NAME]);
		setIsEdit(false);
		setButtonState(issnRequest.state);
	}

	function handleAccept() {
		const newIssnRequest = {
			...issnRequest,
			created: {
				user: userInfo.name.givenName
			},
			state: 'accepted'
		};
		delete newIssnRequest._id;
		updateIssnRequest(issnRequest._id, newIssnRequest, cookie[COOKIE_NAME]);
		setButtonState(issnRequest.state);
		setIsUpdating(true);
	}

	function renderButton(state) {
		switch (state) {
			case 'new':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button disabled={issnRequest.backgroundProcessingState !== 'processed'} variant="outlined" color="primary" onClick={handleAccept}>
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
						<Button variant="outlined" color="primary" onClick={handleAccept}>Accept</Button>
						<Button variant="outlined" style={{color: 'red'}} onClick={handleRejectClick}>
							<FormattedMessage id="publicationRequestRender.button.label.reject"/>
						</Button>
					</ButtonGroup>
				);
			default:
				return null;
		}
	}

	function isEditable(key) {
		const nonEditableFields = userInfo.role === 'admin' ?
			['lastUpdated', '_id', 'associatedRange', 'identifier', 'metadataReference', 'request', 'associatedRange'] :
			(userInfo.role === 'publisher-admin' ?
				['lastUpdated', '_id', 'associatedRange', 'identifier', 'metadataReference', 'request', 'associatedRange'] :
				[]);

		return isEdit && !nonEditableFields.includes(key);
	}

	function formatValueforAssociatedRange(value) {
		return value.map(item => item.subRange);
	}

	const {_id, state, seriesDetails, ...formattedIssnRequest} = {...issnRequest, ...issnRequest.seriesDetails};

	let issnRequestDetail;
	if (formattedIssnRequest === undefined || loading) {
		issnRequestDetail = <Spinner/>;
	} else {
		issnRequestDetail = (
			<>
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.basicInformations"/>
						</Typography>
						<hr/>
						<ListComponent edit={isEdit && isEditable} fieldName="title" label={intl.formatMessage({id: 'listComponent.title'})} value={issnRequest.title ? issnRequest.title : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="subtitle" label={intl.formatMessage({id: 'listComponent.subtitle'})} value={issnRequest.subTitle ? issnRequest.subTitle : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="language" label={intl.formatMessage({id: 'listComponent.language'})} value={issnRequest.language ? issnRequest.language : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="manufacturer" label={intl.formatMessage({id: 'listComponent.manufacturer'})} value={issnRequest.manufacturer ? issnRequest.manufacturer : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="city" label={intl.formatMessage({id: 'listComponent.city'})} value={issnRequest.city ? issnRequest.city : ''}/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.publisher"/>&nbsp;
							<FormattedMessage id="listComponent.informations"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[name]"
							label={intl.formatMessage({id: 'listComponent.name'})}
							value={issnRequest.publisher && issnRequest.publisher.name ? issnRequest.publisher.name : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[postalAddress][address]"
							label={intl.formatMessage({id: 'listComponent.address'})}
							value={issnRequest.publisher && issnRequest.publisher.postalAddress && issnRequest.publisher.postalAddress ?
								issnRequest.publisher.postalAddress.address && issnRequest.publisher.postalAddress.address :
								(issnRequest.publisher && issnRequest.publisher.address ?
									issnRequest.publisher.address :
									'')}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[postalAddress][city]"
							label={intl.formatMessage({id: 'listComponent.city'})}
							value={issnRequest.publisher && issnRequest.publisher.postalAddress && issnRequest.publisher.postalAddress ?
								issnRequest.publisher.postalAddress.city && issnRequest.publisher.postalAddress.city :
								(issnRequest.publisher && issnRequest.publisher.city ?
									issnRequest.publisher.city :
									'')}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[postalAddress][zip]"
							label={intl.formatMessage({id: 'listComponent.zip'})}
							value={issnRequest.publisher && issnRequest.publisher.postalAddress && issnRequest.publisher.postalAddress ?
								issnRequest.publisher.postalAddress.zip && issnRequest.publisher.postalAddress.zip :
								(issnRequest.publisher && issnRequest.publisher.zip ?
									issnRequest.publisher.zip :
									'')}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[phone]"
							label={intl.formatMessage({id: 'listComponent.phone'})}
							value={issnRequest.publisher && issnRequest.publisher.phone ? issnRequest.publisher.phone : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[givenName]"
							label={intl.formatMessage({id: 'listComponent.givenName'})}
							value={issnRequest.publisher && issnRequest.publisher.givenName ? issnRequest.publisher.givenName : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[familyName]"
							label={intl.formatMessage({id: 'listComponent.familyName'})}
							value={issnRequest.publisher && issnRequest.publisher.familyName ? issnRequest.publisher.familyName : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[email]"
							label={intl.formatMessage({id: 'listComponent.email'})}
							value={issnRequest.publisher && issnRequest.publisher.email ? issnRequest.publisher.email : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="publisher[language]"
							label={intl.formatMessage({id: 'listComponent.language'})}
							value={issnRequest.publisher && issnRequest.publisher.language ? issnRequest.publisher.language : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.mainSeries"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[mainSeries][title]"
							label={intl.formatMessage({id: 'listComponent.title'})}
							value={issnRequest.seriesDetails ?
								(issnRequest.seriesDetails.mainSeries ?
									(issnRequest.seriesDetails.mainSeries.title ?
										issnRequest.seriesDetails.mainSeries.title :
										''
									) :
									''
								) :	''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[mainSeries][identifier]"
							label={intl.formatMessage({id: 'listComponent.identifier'})}
							value={issnRequest.seriesDetails ?
								(issnRequest.seriesDetails.mainSeries ?
									(issnRequest.seriesDetails.mainSeries.identifier ?
										issnRequest.seriesDetails.mainSeries.identifier :
										''
									) :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.subSeries"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[subSeries][title]"
							label={intl.formatMessage({id: 'listComponent.title'})}
							value={issnRequest.seriesDetails ?
								(issnRequest.seriesDetails.subSeries ?
									(issnRequest.seriesDetails.subSeries.title ?
										issnRequest.seriesDetails.subSeries.title :
										''
									) :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[subSeries][identifier]"
							label={intl.formatMessage({id: 'listComponent.identifier'})}
							value={issnRequest.seriesDetails ?
								(issnRequest.seriesDetails.subSeries ?
									(issnRequest.seriesDetails.subSeries.identifier ?
										issnRequest.seriesDetails.subSeries.identifier :
										''
									) :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.additionalDetails"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="additionalDetails"
							value={issnRequest.additionalDetails ? issnRequest.additionalDetails : ''}
						/>
					</Grid>
				</Grid>
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h6">
							Time Details
						</Typography>
						<hr/>
						<ListComponent edit={isEdit && isEditable} fieldName="firstYear" label={intl.formatMessage({id: 'listComponent.firstYear'})} value={issnRequest.firstYear ? issnRequest.firstYear : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="firstNumber" label={intl.formatMessage({id: 'listComponent.firstNumber'})} value={issnRequest.firstNumber ? issnRequest.firstNumber : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="frequency" label={intl.formatMessage({id: 'listComponent.frequency'})} value={issnRequest.frequency ? issnRequest.frequency : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="type" label={intl.formatMessage({id: 'listComponent.type'})} value={issnRequest.type ? issnRequest.type : ''}/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.previouslyPublished"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="previousPublication[lastYear]"
							label={intl.formatMessage({id: 'listComponent.lastYear'})}
							value={issnRequest.previousPublication ?
								(issnRequest.previousPublication.lastYear ?
									issnRequest.previousPublication.lastYear :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="previousPublication[lastNumber]"
							label={intl.formatMessage({id: 'listComponent.lastNumber'})}
							value={issnRequest.previousPublication ?
								(issnRequest.previousPublication.lastNumber ?
									issnRequest.previousPublication.lastNumber :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="previousPublication[title]"
							label={intl.formatMessage({id: 'listComponent.title'})}
							value={issnRequest.previousPublication ?
								(issnRequest.previousPublication.title ?
									issnRequest.previousPublication.title :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="previousPublication[identifier]"
							label={intl.formatMessage({id: 'listComponent.identifier'})}
							value={issnRequest.previousPublication ?
								(issnRequest.previousPublication.identifier ?
									issnRequest.previousPublication.identifier :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.formatDetails"/>
						</Typography>
						<hr/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.selectFormat'})}
							value={issnRequest.formatDetails ?
								(issnRequest.formatDetails.format ?
									issnRequest.formatDetails.format :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.fileFormat'})}
							value={issnRequest.formatDetails ?
								(issnRequest.formatDetails.fileFormat ?
									issnRequest.formatDetails.fileFormat :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.printFormat'})}
							value={issnRequest.formatDetails ?
								(issnRequest.formatDetails.printFormat ?
									issnRequest.formatDetails.printFormat :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[formatDetails][manufacturer]"
							label={intl.formatMessage({id: 'listComponent.manufacturer'})}
							value={issnRequest.formatDetails ?
								(issnRequest.formatDetails.manufacturer ?
									issnRequest.formatDetails.manufacturer :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[formatDetails][city]"
							label={intl.formatMessage({id: 'listComponent.city'})}
							value={issnRequest.formatDetails ?
								(issnRequest.formatDetails.city ?
									issnRequest.formatDetails.city :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[formatDetails][run]"
							label={intl.formatMessage({id: 'listComponent.run'})}
							value={issnRequest.formatDetails ?
								(issnRequest.formatDetails.run ?
									issnRequest.formatDetails.run :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[formatDetails][edition]"
							label={intl.formatMessage({id: 'listComponent.edition'})}
							value={issnRequest.formatDetails ?
								(issnRequest.formatDetails.edition ?
									issnRequest.formatDetails.edition :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[formatDetails][identifier]"
							label={intl.formatMessage({id: 'listComponent.identifier'})}
							value={issnRequest.formatDetails ?
								(issnRequest.formatDetails.identifier ?
									issnRequest.formatDetails.identifier :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.metadataReference"/>
						</Typography>
						<hr/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.state'})}
							value={issnRequest.metadataReference ?
								(issnRequest.metadataReference.state ?
									issnRequest.metadataReference.state :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.id'})}
							value={issnRequest.metadataReference ?
								(issnRequest.metadataReference.id ?
									issnRequest.metadataReference.id :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.otherReference"/>
						</Typography>
						<hr/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.state'})} value={issnRequest.state ? issnRequest.state : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.creator'})} value={issnRequest.creator ? issnRequest.creator : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.associatedRange'})} value={issnRequest.associatedRange ? formatValueforAssociatedRange(issnRequest.associatedRange) : ''}/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.creationDetails"/>
						</Typography>
						<hr/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.timestamp'})}
							value={issnRequest.created ?
								(issnRequest.created.timestamp ?
									issnRequest.created.timestamp :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.user'})}
							value={issnRequest.created ?
								(issnRequest.created.user ?
									issnRequest.created.user :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.lastUpdated"/>
						</Typography>
						<hr/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.lastUpdated'})}
							value={issnRequest.lastUpdated ?
								(issnRequest.lastUpdated.timestamp ?
									issnRequest.lastUpdated.timestamp :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.lastUpdatedBy'})}
							value={issnRequest.lastUpdated ?
								(issnRequest.lastUpdated.user ?
									issnRequest.lastUpdated.user :
									''
								) : ''}
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
								<Button variant="contained" color="primary" onClick={handleSubmit(handlePublicationRequestUpdate)}>
									<FormattedMessage id="form.button.label.update"/>
								</Button>
							</div>
							<Grid container item spacing={3} className={classes.listItemSpinner}>
								{issnRequestDetail}
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
									{renderButton(issnRequest.state)}
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
							{issnRequestDetail}
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
		initialValues: state.publication.issnRequest,
		issnRequest: state.publication.issnRequest,
		loading: state.publication.loading,
		isAuthenticated: state.login.isAuthenticated,
		userInfo: state.login.userInfo
	});
}
