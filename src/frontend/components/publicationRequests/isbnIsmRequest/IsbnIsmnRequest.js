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
	List,
	Typography,
	ExpansionPanel,
	ExpansionPanelDetails,
	ExpansionPanelSummary
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';

import {commonStyles} from '../../../styles/app';
import * as actions from '../../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import ModalLayout from '../../ModalLayout';
import Spinner from '../../Spinner';
import ListComponent from '../../ListComponent';
import CustomColor from '../../../styles/app';
import TableComponent from '../../publishersRequests/TableComponent';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publicationRequestIsbnIsmn',
	validate,
	enableReinitialize: true
})(props => {
	const {
		id,
		loading,
		fetchPublicationIsbnIsmnRequest,
		publicationIsbnIsmnRequest,
		updatePublicationIsbnIsmnRequest,
		isbnRangeList,
		ismnRangeList,
		fetchIDRIsbnList,
		fetchIDRIsmnList,
		rangeListLoading
	} = props;
	const classes = commonStyles();
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [buttonState, setButtonState] = useState('');
	const [reject, setReject] = useState(false);
	const [rejectReason, setRejectReason] = useState('');
	const [assignRange, setAssignRange] = useState(false);
	const [rangeType, setRangeType] = useState('');
	const [rangeValue, setRangeValue] = React.useState(null);

	const activeCheck = {
		checked: true
	};

	useEffect(() => {
		if (id !== null) {
			fetchPublicationIsbnIsmnRequest(id, cookie[COOKIE_NAME]);
		}
	}, [cookie, fetchPublicationIsbnIsmnRequest, id, buttonState]);

	function handleRejectClick() {
		setReject(!reject);
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

	function handleAccept() {
		const newPublicationIsbnIsmnRequest = {
			...publicationIsbnIsmnRequest,
			publisher: {...publicationIsbnIsmnRequest.publisher, range: rangeValue},
			state: 'accepted'
		};
		delete newPublicationIsbnIsmnRequest._id;
		updatePublicationIsbnIsmnRequest(publicationIsbnIsmnRequest._id, newPublicationIsbnIsmnRequest, cookie[COOKIE_NAME]);
		setButtonState(publicationIsbnIsmnRequest.state);
	}

	function handleRange() {
		setAssignRange(!assignRange);
		if (publicationIsbnIsmnRequest.type === 'music') {
			fetchIDRIsmnList({searchText: '', token: cookie[COOKIE_NAME], offset: null, activeCheck: activeCheck});
			setRangeType('ismn');
		} else {
			fetchIDRIsbnList({searchText: '', token: cookie[COOKIE_NAME], offset: null, activeCheck: activeCheck});
			setRangeType('isbn');
		}
	}

	function handleChange(e, val) {
		if (val === 'isbn') {
			setRangeValue(e.target.value);
		}

		if (val === 'ismn') {
			setRangeValue(e.target.value);
		}
	}

	function displayRanges(val) {
		if (val === 'isbn') {
			let data;
			if (rangeListLoading) {
				data = <Spinner/>;
			} else if (isbnRangeList.length === 0) {
				data = 'No ranges found';
			} else {
				data = (
					<TableComponent data={isbnRangeList} value={rangeValue} handleChange={e => handleChange(e, 'isbn')}/>
				);
			}

			return data;
		}

		if (val === 'ismn') {
			let data;
			if (rangeListLoading) {
				data = <Spinner/>;
			} else if (ismnRangeList.length === 0) {
				data = 'No ranges found';
			} else {
				data = (
					<TableComponent data={ismnRangeList} value={rangeValue} handleChange={e => handleChange(e, 'ismn')}/>
				);
			}

			return data;
		}

		return <Typography variant="h6">Choose range to assign</Typography>;
	}

	function renderButton(state) {
		switch (state) {
			case 'new':
				return (
					<ButtonGroup color="primary" aria-label="outlined primary button group">
						{
							(rangeValue === null || rangeValue === undefined) ?
								<Button variant="outlined" color="primary" onClick={handleRange}>Assign Ranges</Button> :
								<Button disabled={publicationIsbnIsmnRequest.backgroundProcessingState !== 'processed'} variant="outlined" color="primary" onClick={handleAccept}>Accept</Button>
						}
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

	const {_id, state, ...formattedPublicationIsbnIsmnRequest} = publicationIsbnIsmnRequest;
	const {publisher, ...withoutPublisher} = {...formattedPublicationIsbnIsmnRequest};
	const onlyPublisher = formattedPublicationIsbnIsmnRequest && typeof formattedPublicationIsbnIsmnRequest.publisher === 'object' && formattedPublicationIsbnIsmnRequest.publisher;
	const {organizationDetails, ...formatOnlyPublisher} = {...onlyPublisher, ...onlyPublisher.organizationDetails};

	let publicationIsbnIsmnRequestDetail;
	if (formattedPublicationIsbnIsmnRequest === undefined || loading) {
		publicationIsbnIsmnRequestDetail = <Spinner/>;
	} else {
		publicationIsbnIsmnRequestDetail = (
			<>
				{typeof formattedPublicationIsbnIsmnRequest.publisher === 'string' ?
					<>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(formattedPublicationIsbnIsmnRequest).map(key => {
										return typeof formattedPublicationIsbnIsmnRequest[key] === 'string' ?
											(
												<ListComponent label={key} value={formattedPublicationIsbnIsmnRequest[key]}/>
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
												<ListComponent label={key} value={formattedPublicationIsbnIsmnRequest[key]}/>
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
										return <ListComponent key={key} label={key} value={withoutPublisher[key]}/>;
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
									<Typography variant="h6">Publisher Details</Typography>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<List>
										{
											Object.keys(formatOnlyPublisher).map(key => {
												return <ListComponent key={key} label={key} value={formatOnlyPublisher[key]}/>;
											})
										}
									</List>
								</ExpansionPanelDetails>
							</ExpansionPanel>

						</Grid>
					</>}
			</>
		);
	}

	const component = (
		<ModalLayout isTableRow color="primary" title="Publication Request Detail" {...props}>
			<div className={classes.listItem}>
				{assignRange ?
					<div className={classes.listItem}>
						<Button
							variant="outlined"
							startIcon={<ArrowBackIosIcon/>}
							onClick={handleRange}
						>
								Back
						</Button>
						{displayRanges(rangeType)}
					</div> :
					<Grid container spacing={3} className={classes.listItemSpinner}>
						{publicationIsbnIsmnRequestDetail}
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
									<Button variant="contained" onClick={handleRejectClick}>Cancel</Button>
									<Button variant="contained" color="primary" onClick={handleRejectSubmit}>Submit</Button>
								</Grid>
							</> :
							<Grid item xs={12}>
								{renderButton(publicationIsbnIsmnRequest.state)}
							</Grid>}
					</Grid>}
			</div>
		</ModalLayout>
	);
	return {
		...component
	};
}));

function mapStateToProps(state) {
	return ({
		publicationIsbnIsmnRequest: state.publication.publicationIsbnIsmnRequest,
		loading: state.publication.loading,
		isAuthenticated: state.login.isAuthenticated,
		userInfo: state.login.userInfo,
		isbnRangeList: state.identifierRanges.isbnList,
		ismnRangeList: state.identifierRanges.ismnList,
		rangeListLoading: state.identifierRanges.listLoading
	});
}
