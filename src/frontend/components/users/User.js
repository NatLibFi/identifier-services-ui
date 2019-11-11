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
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {reduxForm, Field} from 'redux-form';
import {useCookies} from 'react-cookie';

import {commonStyles} from '../../styles/app';
import useFormStyles from '../../styles/form';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import ModalLayout from '../ModalLayout';
import Spinner from '../Spinner';
import CustomColor from '../../styles/app';
import renderTextField from '../form/render/renderTextField';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userUpdateForm',
	validate,
	enableReinitialize: true
})(props => {
	const {id, user, userInfo, loading, fetchUser, deleteUser, setModal} = props;
	const classes = commonStyles();
	const formClasses = useFormStyles();
	const {role} = userInfo;
	const [isEdit, setIsEdit] = useState(false);
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);

	useEffect(() => {
		const token = cookie[COOKIE_NAME];
		if (id !== null) {
			fetchUser(id, token);
		}
	}, [cookie, fetchUser, id]);

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleDeleteUser = () => {
		deleteUser(id, cookie[COOKIE_NAME]);
		setModal(false);
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
										{/* eslint-disable-next-line no-negated-condition */}
										{(typeof user[key] !== 'object') ?
											<Grid container>
												<Grid item xs={4}>{key}: </Grid>
												{isEdit ?
													<Grid item xs={8}>
														<Field name={key} className={formClasses.editForm} component={renderTextField}/>
													</Grid> :
													<Grid item xs={8}>{user[key]}</Grid>}
											</Grid> :
											Object.keys(user[key]).map(subKey => subKey !== 'emails' &&
												(
													<Grid key={subKey} container>
														{/* <Grid item xs={4}>{subKey}: </Grid>
														{isEdit ?
															<Grid item xs={8}>
																<Field name={`${key}[${subKey}]`} className={formClasses.editForm} component={renderTextField}/>
															</Grid> :
															<Grid item xs={8}>{user[key][subKey]}</Grid>
														} */}
													</Grid>
												)
											)}
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
		<ModalLayout isTableRow color="primary" {...props} title="User details">
			{isEdit ?
				<div className={classes.listItem}>
					<form>
						<Grid container spacing={3} className={classes.listItemSpinner}>
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
				<div className={classes.listItem}>
					<Grid container spacing={3} className={classes.listItemSpinner}>
						{userDetail}
					</Grid>
					{role !== undefined && role === 'admin' &&
						<div className={classes.usersBtnContainer}>
							<Button
								variant="contained"
								style={CustomColor.palette.red}
								startIcon={<DeleteForeverIcon/>}
								onClick={handleDeleteUser}
							>
								Delete
							</Button>
							<Fab
								color="primary"
								size="small"
								title="Edit User Detail"
								onClick={handleEditClick}
							>
								<EditIcon/>
							</Fab>
						</div>}
				</div>}
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
		userInfo: state.login.userInfo
	});
}
