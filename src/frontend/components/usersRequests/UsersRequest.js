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
	ButtonGroup,
	Button,
	Grid,
	TextareaAutosize,
	Fab,
	Typography
} from '@material-ui/core';
import {validate} from '@natlibfi/identifier-services-commons';
import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';
import {connect} from 'react-redux';
import {FormattedMessage, useIntl} from 'react-intl';
import EditIcon from '@material-ui/icons/Edit';

import {commonStyles} from '../../styles/app';
import * as actions from '../../store/actions';
import Spinner from '../Spinner';
import ListComponent from '../ListComponent';
import CustomColor from '../../styles/app';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userCreation',
	validate,
	enableReinitialize: true
})(props => {
	const {match, isAuthenticated, usersRequest, userInfo, loading, lang, fetchUserRequest, fetchedPublisher, updateUserRequest, userRequestUpdated, fetchPublisher, handleSubmit} = props;
	const {id} = match.params;
	const classes = commonStyles();
	const intl = useIntl();
	const {role} = userInfo;
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [buttonState, setButtonState] = useState('');
	const [reject, setReject] = useState(false);
	const [rejectReason, setRejectReason] = useState('');
	const [isEdit, setIsEdit] = useState(false);
	const [publisherName, setPublisherName] = useState(null);

	useEffect(() => {
		if (id !== null) {
			fetchUserRequest(id, cookie[COOKIE_NAME]);
		}
	}, [cookie, fetchUserRequest, id, buttonState, userRequestUpdated]);

	useEffect(() => {
		if (usersRequest.publisher !== undefined) {
			fetchPublisher(usersRequest.publisher, cookie[COOKIE_NAME]);
		}
	}, [cookie, fetchPublisher, usersRequest.publisher]);

	useEffect(() => {
		if (Object.keys(fetchedPublisher) !== undefined) {
			if (Object.keys(fetchedPublisher).length > 0) {
				setPublisherName(fetchedPublisher.name);
			}
		}
	}, [fetchedPublisher]);

	async function handleAccept() {
		const requestToUpdate = {
			...usersRequest,
			givenName: usersRequest.givenName.toLowerCase(),
			familyName: usersRequest.familyName.toLowerCase(),
			role: usersRequest.role,
			created: {
				user: userInfo.name.givenName
			},
			state: 'accepted'
		};

		await updateUserRequest(id, requestToUpdate, cookie[COOKIE_NAME]);
		setButtonState(usersRequest.state);
	}

	function handleRejectClick() {
		setReject(!reject);
	}

	function handleRejectReason(e) {
		setRejectReason(e.target.value);
	}

	function handleCancel() {
		setIsEdit(false);
	}

	function handleEditClick() {
		setIsEdit(true);
	}

	function handleRejectSubmit() {
		const requestToUpdate = {
			...usersRequest,
			state: 'rejected',
			created: {
				user: userInfo.name.givenName
			},
			rejectionReason: rejectReason
		};
		updateUserRequest(id, requestToUpdate, cookie[COOKIE_NAME], lang);
		setReject(!reject);
		setButtonState(usersRequest.state);
	}

	function handleOnSubmit(values) {
		updateUserRequest(id, values, cookie[COOKIE_NAME], lang);
		setIsEdit(false);
	}

	function isEditable(key) {
		const editableFields = userInfo.role === 'admin' ?
			['role', 'publisher', 'givenName', 'familyName', 'displayname', 'preferences'] :
			(userInfo.role === 'publisher-admin' ?
				['givenName', 'familyName', 'displayname', 'preferences'] :
				[]);

		return isEdit && editableFields.includes(key);
	}

	function renderButton(state) {
		switch (state) {
			case 'new':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button disabled={usersRequest.backgroundProcessingState !== 'processed'} variant="outlined" color="primary" onClick={handleAccept}>Accept</Button>
						<Button variant="outlined" style={{color: 'red'}} onClick={handleRejectClick}>
							<FormattedMessage id="userRequest.button.label.reject"/>
						</Button>
					</ButtonGroup>
				);
			case 'accepted':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button variant="contained" color="primary" size="small" style={{cursor: 'not-allowed'}}>
							<FormattedMessage id="userRequest.button.label.accepted"/>
						</Button>
					</ButtonGroup>
				);
			case 'rejected':
				return (
					<ButtonGroup color="error" aria-label="outlined primary button group">
						<Button variant="contained" style={CustomColor.palette.red} size="small">
							<FormattedMessage id="userRequest.button.label.rejected"/>
						</Button>
					</ButtonGroup>
				);
			case 'inProgress':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button variant="outlined" color="primary" onClick={handleAccept}>
							<FormattedMessage id="userRequest.button.label.accept"/>
						</Button>
						<Button variant="outlined" style={{color: 'red'}} onClick={handleRejectClick}>
							<FormattedMessage id="userRequest.button.label.reject"/>
						</Button>
					</ButtonGroup>
				);
			default:
				return null;
		}
	}

	let userRequestDetail;
	if (usersRequest === undefined || loading) {
		userRequestDetail = <Spinner/>;
	} else {
		userRequestDetail = (
			<>
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Grid item xs={12}>
							<Typography variant="h6">
								<FormattedMessage id="listComponent.basicInformations"/>
							</Typography>
							<hr/>
							<ListComponent
								label={intl.formatMessage({id: 'listComponent.email'})}
								value={usersRequest.email ? usersRequest.email : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="givenName"
								label={intl.formatMessage({id: 'listComponent.givenName'})}
								value={usersRequest.givenName ? usersRequest.givenName : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="familyName"
								label={intl.formatMessage({id: 'listComponent.familyName'})}
								value={usersRequest.familyName ? usersRequest.familyName : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="state"
								label={intl.formatMessage({id: 'listComponent.state'})}
								value={usersRequest.state ? usersRequest.state : ''}
							/>
							<ListComponent
								fieldName="role"
								label={intl.formatMessage({id: 'listComponent.role'})}
								value={usersRequest.role ? usersRequest.role : ''}
							/>
							<ListComponent
								fieldName="userId"
								label={intl.formatMessage({id: 'listComponent.userId'})}
								value={usersRequest.userId ? usersRequest.userId : ''}
							/>
							<ListComponent
								fieldName="creator"
								label={intl.formatMessage({id: 'listComponent.creator'})}
								value={usersRequest.creator ? usersRequest.creator : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="publisher"
								label={intl.formatMessage({id: 'listComponent.publisher'})}
								value={usersRequest.publisher && publisherName !== null ? publisherName : ''}
							/>
							<ListComponent
								edit={isEdit && isEditable}
								fieldName="backgroundProcessingState"
								label={intl.formatMessage({id: 'listComponent.backgroundProcessingState'})}
								value={usersRequest.backgroundProcessingState ? usersRequest.backgroundProcessingState : ''}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.preferences"/>
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable}
							fieldName="preferences[defaultLanguage]"
							label={intl.formatMessage({id: 'listComponent.defaultLanguage'})}
							value={usersRequest.preferences && usersRequest.preferences.defaultLanguage ? usersRequest.preferences.defaultLanguage : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							<FormattedMessage id="listComponent.creationDetails"/>
						</Typography>
						<hr/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.timestamp'})}
							value={usersRequest.created ?
								(usersRequest.created.timestamp ?
									usersRequest.created.timestamp :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.user'})}
							value={usersRequest.created ?
								(usersRequest.created.user ?
									usersRequest.created.user :
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
							label={intl.formatMessage({id: 'listComponent.timestamp'})}
							value={usersRequest.lastUpdated ?
								(usersRequest.lastUpdated.timestamp ?
									usersRequest.lastUpdated.timestamp :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.user'})}
							value={usersRequest.lastUpdated ?
								(usersRequest.lastUpdated.user ?
									usersRequest.lastUpdated.user :
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
			{isEdit ?
				<div className={classes.listItem}>
					<form onSubmit={handleSubmit(handleOnSubmit)}>
						<div className={classes.btnContainer}>
							<Button onClick={handleCancel}>
								<FormattedMessage id="form.button.label.cancel"/>
							</Button>
							<Button variant="contained" color="primary" type="submit">
								<FormattedMessage id="form.button.label.update"/>
							</Button>
						</div>
						<Grid container spacing={3} className={classes.listItemSpinner}>
							{userRequestDetail}
						</Grid>
					</form>
				</div> :
				<div className={classes.listItem}>
					{
						isAuthenticated && (role === 'admin' || role === 'publisher-admin') &&
							(
								role !== undefined && role === 'admin' ?
									(reject ? (
										<>
											<Grid item xs={12}>
												<TextareaAutosize
													aria-label={intl.formatMessage({id: 'userRequest.textArea.ariaLabel.minHeight'})}
													rows={8}
													placeholder={intl.formatMessage({id: 'userRequest.textArea.placeholder'})}
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
										</>
									) : (
										<Grid item xs={12}>
											{renderButton(usersRequest.state)}
											<Fab
												color="primary"
												size="small"
												title={intl.formatMessage({id: 'user.fab.label.editUserRequest'})}
												className={classes.fab}
												onClick={handleEditClick}
											>
												<EditIcon/>
											</Fab>
										</Grid>
									)
									) : (
										<Grid item xs={12}>
											<Fab
												color="primary"
												size="small"
												title={intl.formatMessage({id: 'user.fab.label.editUserRequest'})}
												onClick={handleEditClick}
											>
												<EditIcon/>
											</Fab>
										</Grid>
									)
							)
					}
					<Grid container spacing={3} className={classes.listItemSpinner}>
						{userRequestDetail}
					</Grid>
				</div>}
		</Grid>
	);
	return {
		...component
	};
}));

function mapStateToProps(state) {
	return ({
		lang: state.locale.lang,
		usersRequest: state.users.usersRequest,
		loading: state.users.loading,
		initialValues: state.users.usersRequest,
		userInfo: state.login.userInfo,
		userRequestUpdated: state.users.userRequestUpdated,
		isAuthenticated: state.login.isAuthenticated,
		fetchedPublisher: state.publisher.publisher,
		publisherLoading: state.publisher.loading
	});
}
