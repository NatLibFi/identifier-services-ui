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
	ListItem,
	ListItemText,
	Typography
} from '@material-ui/core';
import {reduxForm, Field} from 'redux-form';
import {useCookies} from 'react-cookie';

import useStyles from '../../styles/publisher';
import useFormStyles from '../../styles/form';
import {commonStyles} from '../../styles/app';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import Spinner from '../Spinner';
import renderTextField from '../form/render/renderTextField';
import ListComponent from '../ListComponent';
import EditIcon from '@material-ui/icons/Edit';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publisherUpdateForm',
	validate,
	enableReinitialize: true
})(props => {
	const {
		fetchPublisher,
		updatePublisher,
		match,
		publisher,
		loading,
		handleSubmit,
		isAuthenticated,
		userInfo} = props;
	const classes = useStyles();
	const formClasses = useFormStyles();
	const commonStyle = commonStyles();
	const [isEdit, setIsEdit] = useState(false);
	const [cookie] = useCookies('login-cookie');
	useEffect(() => {
		// eslint-disable-next-line no-undef
		fetchPublisher(match.params.id, cookie['login-cookie']);
	}, [cookie, fetchPublisher, match.params.id]);
	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	const formatPublisherDetail = {...publisher, ...publisher.organizationDetails};
	const {organizationDetails, _id, ...formattedPublisherDetail} = formatPublisherDetail;
	let publisherDetail;
	if ((Object.keys(publisher).length === 0) || loading) {
		publisherDetail = <Spinner/>;
	} else {
		publisherDetail = (
			<>
				{isEdit ?
					<>
						<Grid item xs={12} md={9}>
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
						</Grid>
					</> :
					<>
						<Grid item xs={12} md={9}>
							<List>
								{
									Object.keys(formattedPublisherDetail).map(key => {
										return typeof formattedPublisherDetail[key] === 'string' ?
											(
												<ListComponent label={key} value={formattedPublisherDetail[key]}/>
											) :
											null;
									})
								}
							</List>
							<List>
								{
									Object.keys(formattedPublisherDetail).map(key => {
										return typeof formattedPublisherDetail[key] === 'object' ?
											(
												<ListComponent label={key} value={formattedPublisherDetail[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
					</>
				}
			</>
		);
	}

	const handlePublisherUpdate = values => {
		const {_id, ...updateValues} = values;
		const token = cookie['login-cookie'];
		updatePublisher(match.params.id, updateValues, token);
		setIsEdit(false);
	};

	const component = (
		<section className={classes.publisherProfileContainer}>
			{isEdit ?
				<div className={classes.publisherProfile}>
					<form>
						<Grid container spacing={3} className={commonStyle.listItemSpinner}>
							{publisherDetail}
							<Grid item className={commonStyle.btnContainer}xs={12} md={3}>
								<Button onClick={handleCancel}>Cancel</Button>
								<Button variant="contained" color="primary" onClick={handleSubmit(handlePublisherUpdate)}>
								UPDATE
								</Button>
							</Grid>
						</Grid>
					</form>
				</div> :
				<div className={classes.publisherProfile}>
					<Grid container spacing={3} className={commonStyle.listItemSpinner}>
						<Grid item xs={12}>
							<Typography variant="h4">My Information</Typography>
						</Grid>
						{publisherDetail}
						{isAuthenticated && userInfo.role === 'publisher-admin' &&
						<Grid item xs={12} md={3}>
							<Button color="primary" variant="outlined" size="large" onClick={handleEditClick}>
								<EditIcon/> Edit
							</Button>
						</Grid>}
					</Grid>
				</div>
			}
		</section>
	);
	return {
		...component
	};
}));

function mapStateToProps(state) {
	return ({
		publisher: state.publisher.publisher,
		loading: state.publisher.loading,
		initialValues: state.publisher.publisher,
		isAuthenticated: state.login.isAuthenticated,
		userInfo: state.login.userInfo
	});
}
