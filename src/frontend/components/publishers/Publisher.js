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
	Fab
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import {reduxForm, Field} from 'redux-form';
import {useCookies} from 'react-cookie';

import {commonStyles} from '../../styles/app';
import useFormStyles from '../../styles/form';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import ModalLayout from '../ModalLayout';
import Spinner from '../Spinner';
import renderTextField from '../form/render/renderTextField';
import ListComponent from '../ListComponent';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publisherUpdateForm',
	validate,
	enableReinitialize: true
})(props => {
	const {
		fetchPublisher,
		updatePublisher,
		id,
		publisher,
		loading,
		handleSubmit,
		isAuthenticated,
		userInfo} = props;
	const classes = commonStyles();
	const formClasses = useFormStyles();
	const [isEdit, setIsEdit] = useState(false);
	const [cookie] = useCookies('login-cookie');

	useEffect(() => {
		if (id !== null) {
			fetchPublisher(id, cookie['login-cookie']);
		}
	}, [cookie, fetchPublisher, id]);

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	const {organizationDetails, _id, ...formattedPublisherDetail} = {...publisher, ...publisher.organizationDetails, notes: publisher && publisher.notes && publisher.notes.map(item => {
		return {note: Buffer.from(item).toString('base64')};
	})};
	let publisherDetail;
	if ((Object.keys(publisher).length === 0) || loading) {
		publisherDetail = <Spinner/>;
	} else {
		publisherDetail = (
			<>
				{isEdit ?
					<>
						<Grid item xs={12} md={6}>
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
						<Grid item xs={12} md={6}>
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
						</Grid>
						<Grid item xs={12} md={6}>
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
		updatePublisher(id, updateValues, token);
		setIsEdit(false);
	};

	const component = (
		<ModalLayout isTableRow color="primary" title="Publisher Detail" {...props}>
			{isEdit ?
				<div className={classes.listItem}>
					<form>
						<Grid container spacing={3} className={classes.listItemSpinner}>
							{publisherDetail}
						</Grid>
						<div className={classes.btnContainer}>
							<Button onClick={handleCancel}>Cancel</Button>
							<Button variant="contained" color="primary" onClick={handleSubmit(handlePublisherUpdate)}>
                            UPDATE
							</Button>
						</div>
					</form>
				</div> :
				<div className={classes.listItem}>
					<Grid container spacing={3} className={classes.listItemSpinner}>
						{publisherDetail}
					</Grid>
					{isAuthenticated && userInfo.role === 'publisher' &&
						<div className={classes.btnContainer}>
							<Fab
								color="primary"
								size="small"
								title="Edit Publisher Detail"
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
		publisher: state.publisher.publisher,
		loading: state.publisher.loading,
		initialValues: state.publisher.publisher,
		isAuthenticated: state.login.isAuthenticated,
		userInfo: state.login.userInfo
	});
}
