/* eslint-disable no-negated-condition */

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
	Typography,
	Button,
	Grid,
	List,
	ListItem,
	ListItemText,
	Fab
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';

import useStyles from '../../styles/publisher';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import ModalLayout from '../ModalLayout';
import Spinner from '../Spinner';
import UserCreationForm from '../form/UserCreationForm';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userCreation',
	validate,
	enableReinitialize: true
})(props => {
	const {match, usersRequest, userInfo, loading, fetchUserRequest, updateUserRequest, apiURL} = props;
	const classes = useStyles();
	const {role} = userInfo;
	const [isEdit, setIsEdit] = useState(false);
	const [cookie] = useCookies('login-cookie');

	useEffect(() => {
		const token = cookie['login-cookie'];
		// eslint-disable-next-line no-unused-expressions
		apiURL !== null && fetchUserRequest({API_URL: apiURL}, match.params.id, token);
		const requestToUpdate = {
			...usersRequest,
			state: 'inProgress',
			backgroundProcessingState: 'inProgress'
		};
		// eslint-disable-next-line no-unused-expressions
		usersRequest.id && updateUserRequest({API_URL: apiURL}, match.params.id, requestToUpdate, token);
	}, [apiURL, cookie, fetchUserRequest, match.params.id, updateUserRequest, usersRequest]);

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	let userRequestDetail;
	if (usersRequest.length < 1 || loading) {
		userRequestDetail = <Spinner/>;
	} else {
		userRequestDetail = (
			<>
				<Grid item xs={12}>
					{isEdit ?
						<UserCreationForm/> :
						<List>
							<Grid container xs={12}>
								{Object.keys(usersRequest).map(key => (
									<ListItem key={key}>
										<ListItemText>
											{(typeof usersRequest[key] !== 'object') ?
												<Grid container>
													<Grid item xs={4}>{key}: </Grid>
													<Grid item xs={8}>{usersRequest[key]}</Grid>
												</Grid> :
												Object.keys(usersRequest[key]).map(subKey => (
													<Grid key={subKey} container>
														<Grid item xs={4}>{subKey}: </Grid>
														<Grid item xs={8}>{usersRequest[key][subKey]}</Grid>
													</Grid>
												))}
										</ListItemText>
									</ListItem>
								))}
							</Grid>
						</List>
					}
				</Grid>
			</>
		);
	}

	const component = (
		<ModalLayout isTableRow color="primary">
			<>
				<Typography variant="h6">
					Users Request Details
				</Typography>
				{isEdit ?
					<div className={classes.publisher}>
						<form>
							<Grid container spacing={3} className={classes.publisherSpinner}>
								{userRequestDetail}
							</Grid>
							<div className={classes.btnContainer}>
								<Button onClick={handleCancel}>Cancel</Button>
								<Fab
									color="primary"
									size="small"
									title="Done"
								// OnClick={handleEditClick}
								>
									<DoneIcon/>
								</Fab>
							</div>
						</form>
					</div> :
					<div className={classes.publisher}>
						<Grid container spacing={3} className={classes.publisherSpinner}>
							{userRequestDetail}
						</Grid>
						{role !== undefined && role.some(item => item === 'admin') &&
							<div className={classes.btnContainer}>
								<Fab
									color="primary"
									size="small"
									title="Edit User Detail"
									onClick={handleEditClick}
								>
									<EditIcon/>
								</Fab>
							</div>}
					</div>
				}
			</>
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
		userInfo: state.login.userInfo,
		apiURL: state.common.apiURL
	});
}
