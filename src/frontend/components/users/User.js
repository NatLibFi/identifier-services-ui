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
	Button,
	Grid,
	List,
	Fab
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';
import {FormattedMessage, useIntl} from 'react-intl';
import HttpStatus from 'http-status';

import {commonStyles} from '../../styles/app';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import Spinner from '../Spinner';
import CustomColor from '../../styles/app';
import ListComponent from '../ListComponent';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userUpdateForm',
	validate,
	enableReinitialize: true
})(props => {
	const {user, userInfo, isAuthenticated, handleSubmit, updateUser, userUpdated, loading, fetchUser, deleteUser, setModal, setIsCreating, match} = props;
	const {id} = match.params;
	const classes = commonStyles();
	const intl = useIntl();
	const {role} = userInfo;
	const [isEdit, setIsEdit] = useState(false);
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);

	useEffect(() => {
		const token = cookie[COOKIE_NAME];
		if (id !== null) {
			fetchUser(id, token);
		}
	}, [cookie, fetchUser, id, userUpdated]);

	const handleEditClick = () => {
		setIsEdit(true);
	};

	async function handleDeleteUser() {
		const response = await deleteUser(id, cookie[COOKIE_NAME]);
		if (response === HttpStatus.OK) {
			setIsCreating(true);
		}

		setModal(false);
	}

	const handleCancel = () => {
		setIsEdit(false);
	};

	const handleOnSubmit = values => {
		const newValues = {...values, givenName: values.firstname, familyName: values.lastname, displayName: values.displayname};
		updateUser(id, newValues, cookie[COOKIE_NAME]);
		setIsEdit(false);
	};

	function isEditable(key) {
		const editableFields = userInfo.role === 'admin' ?
			['id', 'publisher', 'firstname', 'lastname', 'displayname', 'preferences'] :
			(userInfo.role === 'publisher-admin' ?
				['firstname', 'lastname', 'displayname', 'preferences'] :
				[]);

		return isEdit && editableFields.includes(key);
	}

	let userDetail;
	if ((Object.keys(user).length === 0) || loading) {
		userDetail = <Spinner/>;
	} else {
		userDetail = (
			<>
				{isEdit ?
					<>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(user).map(key => {
										return typeof user[key] === 'string' ?
											(
												<ListComponent edit={isEditable(key)} fieldName={key} label={intl.formatMessage({id: `user.label.${key}`})} value={user[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(user).map(key => {
										return typeof user[key] === 'object' ?
											(
												<ListComponent edit={isEditable(key)} fieldName={key} label={intl.formatMessage({id: `user.label.${key}`})} value={user[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
						{/* <Grid item xs={12} md={6}>
							<List>
								<ListItem>
									<ListItemText>
										<Grid container>
											<Grid item xs={4}>Name:</Grid>
											<Grid item xs={8}><Field name="name" className={formClasses.editForm} component={renderTextField}/></Grid>
										</Grid>
									</ListItemText>
								</ListItem>
							</List>
						</Grid> */}
					</> :
					<>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(user).map(key => {
										return typeof user[key] === 'string' ?
											(
												<ListComponent label={intl.formatMessage({id: `user.label.${key}`})} value={user[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(user).map(key => {
										return typeof user[key] === 'object' ?
											(
												<ListComponent fieldName={key} label={intl.formatMessage({id: `user.label.${key}`})} value={user[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
					</>}
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
							{userDetail}
						</Grid>
					</form>
				</div> :
				<div className={classes.listItem}>
					<div className={classes.usersBtnContainer}>
						{isAuthenticated && role === 'admin' &&
							<Button
								variant="contained"
								style={CustomColor.palette.red}
								startIcon={<DeleteForeverIcon/>}
								onClick={handleDeleteUser}
							>
								<FormattedMessage id="user.button.label.delete"/>
							</Button>}
						{isAuthenticated && (role === 'admin' || role === 'publisher-admin') &&
							<Fab
								color="primary"
								size="small"
								title={intl.formatMessage({id: 'user.fab.label.editUser'})}
								onClick={handleEditClick}
							>
								<EditIcon/>
							</Fab>}
					</div>
					<Grid container spacing={3} className={classes.listItemSpinner}>
						{userDetail}
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
		user: state.users.user,
		userUpdated: state.users.userUpdated,
		loading: state.users.loading,
		initialValues: state.users.user,
		userInfo: state.login.userInfo,
		isAuthenticated: state.login.isAuthenticated
	});
}
