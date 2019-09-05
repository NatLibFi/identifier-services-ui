
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
	List
} from '@material-ui/core';
import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';

import useStyles from '../../styles/publisher';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import ModalLayout from '../ModalLayout';
import Spinner from '../Spinner';
import ListComponent from '../ListComponent';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userCreation',
	validate,
	enableReinitialize: true
})(props => {
	const {match, loading, fetchPublisherRequest, publisherRequest} = props;
	const classes = useStyles();
	const [cookie] = useCookies('login-cookie');
	const [reject, setReject] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line no-undef
		fetchPublisherRequest(match.params.id, cookie['login-cookie']);
	}, [cookie, fetchPublisherRequest, match.params.id]);

	function handleRejectClick() {
		setReject(!reject);
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
					{
						Object.keys(formattedPublisherRequest).map(key => {
							return typeof formattedPublisherRequest[key] === 'string' ?
								(
									<ListComponent label={key} value={formattedPublisherRequest[key]}/>
								) :
								null;
						})
					}
				</Grid>
				<Grid item xs={12} md={6}>
					{
						Object.keys(formattedPublisherRequest).map(key => {
							return typeof formattedPublisherRequest[key] === 'object' ?
								(
									<ListComponent label={key} value={formattedPublisherRequest[key]}/>
								) :
								null;
						})
					}
				</Grid>
			</>
		);
	}

	const component = (
		<ModalLayout isTableRow color="primary" title="Publisher Request Detail">
			<div className={classes.publisher}>
				<Grid container spacing={3} className={classes.publisherSpinner}>
					{publisherRequestDetail}
					{reject ?
						<>
							<Grid item xs={12}>
								<TextareaAutosize
									aria-label="Minimum height"
									rows={8}
									placeholder="Rejection reason here..."
									className={classes.textArea}
								/>
							</Grid>
							<Grid item xs={12}>
								<Button variant="contained" onClick={handleRejectClick}>Cancel</Button>
								<Button variant="contained" color="primary">Submit</Button>
							</Grid>
						</> :
						<Grid item xs={12}>
							<ButtonGroup color="primary" aria-label="outlined primary button group">
								<Button>Accept</Button>
								<Button onClick={handleRejectClick}>Reject</Button>
							</ButtonGroup>
						</Grid>
					}
				</Grid>
			</div>
		</ModalLayout>
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
		userInfo: state.login.userInfo
	});
}
