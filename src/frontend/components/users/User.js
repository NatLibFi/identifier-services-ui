/* eslint-disable no-negated-condition */
/* eslint-disable react-hooks/exhaustive-deps */

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
import {reduxForm, Field} from 'redux-form';
import {useCookies} from 'react-cookie';

import useStyles from '../../styles/publisher';
import useFormStyles from '../../styles/form';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import ModalLayout from '../ModalLayout';
import Spinner from '../Spinner';
import renderTextField from '../form/render/renderTextField';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userCreation',
	validate,
	enableReinitialize: true
})(props => {
	const {match, user, userInfo, loading, fetchUser, apiURL} = props;
	const classes = useStyles();
	const formClasses = useFormStyles();
	const {role} = userInfo;
	const [isEdit, setIsEdit] = useState(false);
	const [cookie] = useCookies('login-cookie');

	useEffect(() => {
		const token = cookie['login-cookie'];
		// eslint-disable-next-line no-unused-expressions
		apiURL !== null && fetchUser({API_URL: apiURL}, match.params.id, token);
	}, [user === undefined]);

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	let userDetail;
	let keys = isEdit ? Object.keys(user).filter(key => key !== 'lastUpdated') : Object.keys(user).map(key => key);
	if (user === undefined || loading) {
		userDetail = <Spinner/>;
	} else {
		userDetail = (
			<Grid item xs={12}>
				<Typography variant="h6">
						User Details
				</Typography>
				<List>
					<Grid container xs={12}>
						{keys.map(key => {
							return (
								<ListItem key={key}>
									<ListItemText>
										{(typeof user[key] !== 'object') ?
											<Grid container>
												<Grid item xs={4}>{key}: </Grid>
												{isEdit ?
													<Grid item xs={8}>
														<Field name={key} className={formClasses.editForm} component={renderTextField}/>
													</Grid> :
													<Grid item xs={8}>{user[key]}</Grid>
												}
											</Grid> :
											Object.keys(user[key]).map(subKey =>
												(
													<Grid key={subKey} container>
														<Grid item xs={4}>{subKey}: </Grid>
														{isEdit ?
															<Grid item xs={8}>
																<Field name={`${key}[${subKey}]`} className={formClasses.editForm} component={renderTextField}/>
															</Grid> :
															<Grid item xs={8}>{user[key][subKey]}</Grid>
														}
													</Grid>
												)
											)
										}
									</ListItemText>
								</ListItem>
							);
						}
						)}
					</Grid>
				</List>
			</Grid>
		);
	}

	const component = (
		<ModalLayout isTableRow color="primary">
			{isEdit ?
				<div className={classes.publisher}>
					<form>
						<Grid container spacing={3} className={classes.publisherSpinner}>
							{userDetail}
						</Grid>
						<div className={classes.btnContainer}>
							<Button onClick={handleCancel}>Cancel</Button>
							<Button variant="contained" color="primary">
								UPDATE
							</Button>
						</div>
					</form>
				</div> :
				<div className={classes.publisher}>
					<Grid container spacing={3} className={classes.publisherSpinner}>
						{userDetail}
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
		</ModalLayout>
	);
	return {
		...component
	};
}));

function mapStateToProps(state) {
	return ({
		user: state.users.user,
		loading: state.users.loading,
		initialValues: state.users.user,
		userInfo: state.login.userInfo,
		apiURL: state.common.apiURL
	});
}
