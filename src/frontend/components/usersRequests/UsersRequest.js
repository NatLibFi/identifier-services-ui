
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
	List,
	TextareaAutosize
} from '@material-ui/core';

import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';
import {commonStyles} from '../../styles/app';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import ModalLayout from '../ModalLayout';
import Spinner from '../Spinner';
import ListComponent from '../ListComponent';
import CustomColor from '../../styles/app';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userCreation',
	validate,
	enableReinitialize: true
})(props => {
	const {id, usersRequest, userInfo, loading, fetchUserRequest, updateUserRequest} = props;
	const classes = commonStyles();
	const {role} = userInfo;
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [buttonState, setButtonState] = useState('');
	const [reject, setReject] = useState(false);
	const [rejectReason, setRejectReason] = useState('');

	useEffect(() => {
		if (id !== null) {
			fetchUserRequest(id, cookie[COOKIE_NAME]);
		}
	}, [cookie, fetchUserRequest, id, buttonState]);

	async function handleAccept() {
		const requestToUpdate = {
			...usersRequest,
			givenName: usersRequest.givenName.toLowerCase(),
			familyName: usersRequest.familyName.toLowerCase(),
			role: usersRequest.role,
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

	function handleRejectSubmit() {
		const requestToUpdate = {
			...usersRequest,
			state: 'rejected',
			rejectionReason: rejectReason
		};
		updateUserRequest(id, requestToUpdate, cookie[COOKIE_NAME]);
		setReject(!reject);
		setButtonState(usersRequest.state);
	}

	function renderButton(state) {
		switch (state) {
			case 'new':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button disabled={usersRequest.backgroundProcessingState !== 'processed'} variant="outlined" color="primary" onClick={handleAccept}>Accept</Button>
						<Button variant="outlined" style={{color: 'red'}} onClick={handleRejectClick}>Reject</Button>
					</ButtonGroup>
				);
			case 'accepted':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button variant="contained" color="primary" size="small" style={{cursor: 'not-allowed'}}>Accepted</Button>
					</ButtonGroup>
				);
			case 'rejected':
				return (
					<ButtonGroup color="error" aria-label="outlined primary button group">
						<Button variant="contained" style={CustomColor.palette.red} size="small">Rejected</Button>
					</ButtonGroup>
				);
			case 'inProgress':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						<Button variant="outlined" color="primary" onClick={handleAccept}>Accept</Button>
						<Button variant="outlined" style={{color: 'red'}} onClick={handleRejectClick}>Reject</Button>
					</ButtonGroup>
				);
			default:
				return null;
		}
	}

	let userRequestDetail;
	if (usersRequest.length < 1 || loading) {
		userRequestDetail = <Spinner/>;
	} else {
		userRequestDetail = (
			<>
				<Grid item xs={12} md={6}>
					<List>
						{
							Object.keys(usersRequest).map(key => {
								return typeof usersRequest[key] === 'string' ?
									(
										<ListComponent label={key} value={usersRequest[key]}/>
									) :
									null;
							})
						}
					</List>
				</Grid>
				<Grid item xs={12} md={6}>
					<List>
						{
							Object.keys(usersRequest).map(key => {
								return typeof usersRequest[key] === 'object' ?
									(
										<ListComponent label={key} value={usersRequest[key]}/>
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
		<ModalLayout isTableRow color="primary" title="User Request Detail" {...props}>
			<div className={classes.listItem}>
				<Grid container spacing={3} className={classes.listItemSpinner}>
					{userRequestDetail}
				</Grid>
				{role !== undefined && role === 'admin' &&
					reject ? (
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
								<Button variant="contained" onClick={handleRejectClick}>Cancel</Button>
								<Button variant="contained" color="primary" onClick={handleRejectSubmit}>Submit</Button>
							</Grid>
						</>
					) : (
						<Grid item xs={12}>
							{renderButton(usersRequest.state)}
						</Grid>
					)}
			</div>
		</ModalLayout>
	);
	return {
		...component
	};
}));

function mapStateToProps(state) {
	return ({
		usersRequest: state.users.usersRequest,
		loading: state.users.loading,
		initialValues: state.users.usersRequest,
		userInfo: state.login.userInfo
	});
}
