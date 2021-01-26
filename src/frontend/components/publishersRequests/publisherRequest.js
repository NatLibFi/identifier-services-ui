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
	List
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

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userCreation',
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
	}, [cookie, fetchPublisherRequest, id, buttonState]);
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

	function handlePublisherUpdate() {
		const newPublisherRequest = {
			...publisherRequest,
			state: 'new',
			backgroundProcessingState: 'inProgress'
		};
		delete newPublisherRequest._id;
		updatePublisherRequest(publisherRequest._id, newPublisherRequest, cookie[COOKIE_NAME]);
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
				<Grid item xs={12} md={6}>
					<List>
						{
							Object.keys(formattedPublisherRequest).map(key => {
								return typeof formattedPublisherRequest[key] === 'string' ?
									(
										<ListComponent label={intl.formatMessage({id: `publisherRender.label.${key}`})} value={formattedPublisherRequest[key]}/>
									) :
									null;
							})
						}
					</List>
				</Grid>
				<Grid item xs={12} md={6}>
					<List>
						{
							Object.keys(formattedPublisherRequest).map(key => {
								return typeof formattedPublisherRequest[key] === 'object' ?
									(
										<ListComponent label={intl.formatMessage({id: `publisherRender.label.${key}`})} value={formattedPublisherRequest[key]}/>
									) :
									null;
							})
						}
					</List>
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
		publisherRequest: state.publisher.publisherRequest,
		loading: state.publisher.loading,
		isAuthenticated: state.login.isAuthenticated,
		userInfo: state.login.userInfo,
		rangleListLoading: state.identifierRanges.rangeListLoading,
		isbnRangeList: state.identifierRanges.isbnList,
		ismnRangeList: state.identifierRanges.ismnList
	});
}
