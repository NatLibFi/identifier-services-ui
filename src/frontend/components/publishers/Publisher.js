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
	Fab,
	Chip,
	Paper,
	ExpansionPanel,
	ExpansionPanelDetails,
	ExpansionPanelSummary
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import {reduxForm, Field, FieldArray} from 'redux-form';
import {useCookies} from 'react-cookie';

import useStyles from '../../styles/publisher';
import useFormStyles from '../../styles/form';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import ModalLayout from '../ModalLayout';
import Spinner from '../Spinner';
import renderTextField from '../form/render/renderTextField';
import renderAliases from '../form/render/renderAliases';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publisherRegistrationForm',
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
		clearFields,
		isAuthenticated,
		userInfo} = props;
	const classes = useStyles();
	const formClasses = useFormStyles();
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

	let publisherDetail;
	if ((Object.keys(publisher).length === 0) || loading) {
		publisherDetail = <Spinner/>;
	} else {
		publisherDetail = (
			<>
				<Typography variant="h6">
					Publisher Detail
				</Typography>
				<Grid item xs={12} md={6}>
					<List>
						<ListItem>
							<ListItemText>
								<Grid container>
									<Grid item xs={4}>Name:</Grid>
									{isEdit ?
										<Grid item xs={8}><Field name="name" className={formClasses.editForm} component={renderTextField}/></Grid> :
										<Grid item xs={8}>{publisher.name}</Grid>
									}
								</Grid>
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								<Grid container>
									<Grid item xs={4}>Language:</Grid>
									{isEdit ?
										<Grid item xs={8}><Field name="language" className={formClasses.editForm} component={renderTextField}/></Grid> :
										<Grid item xs={8}>{publisher.language}</Grid>}
								</Grid>
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								<Grid container>
									<Grid item xs={4}>Metadata Delivery:</Grid>
									{isEdit ?
										<Grid item xs={8}><Field name="metadataDelivery" className={formClasses.editForm} component={renderTextField}/></Grid> :
										<Grid item xs={8}>{publisher.metadataDelivery}</Grid>
									}
								</Grid>
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								<Grid container>
									<Grid item xs={4}>Email:</Grid>
									{isEdit ?
										<Grid item xs={8}><Field name="email" className={formClasses.editForm} component={renderTextField}/></Grid> :
										<Grid item xs={8}>{publisher.email}</Grid>
									}
								</Grid>
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								<Grid container>
									<Grid item xs={4}>Phone:</Grid>
									{isEdit ?
										<Grid item xs={8}><Field name="phone" className={formClasses.editForm} component={renderTextField}/></Grid> :
										<Grid item xs={8}>{publisher.phone}</Grid>
									}
								</Grid>
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								<Grid container>
									<Grid item xs={4}>Website:</Grid>
									{isEdit ?
										<Grid item xs={8}><Field name="website" className={formClasses.editForm} component={renderTextField}/></Grid> :
										<Grid item xs={8}>{publisher.website}</Grid>
									}
								</Grid>
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								<Grid container>
									<Grid item xs={4}>Aliases:</Grid>
									{isEdit ?
										<Grid item xs={8}><FieldArray name="aliases" className={formClasses.editForm} component={renderAliases} props={{clearFields, name: 'aliases', subName: 'alias'}}/></Grid> :
										<Grid item xs={8}>{publisher.aliases.map(item => {
											return (
												<Chip key={item} label={item}/>
											);
										})}
										</Grid>}
								</Grid>
							</ListItemText>
						</ListItem>
					</List>
				</Grid>
				<Grid item xs={12} md={6}>
					<List>
						<ListItem>
							<ListItemText>
								<Grid container>
									<Grid item xs={4}>Address:</Grid>
									{isEdit ?
										<Grid item xs={8}><Field name="streetAddress['address']" className={formClasses.editForm} component={renderTextField}/></Grid> :
										<Grid item xs={8}>{publisher.streetAddress.address}</Grid>
									}
								</Grid>
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								<Grid container>
									<Grid item xs={4}>City:</Grid>
									{isEdit ?
										<Grid item xs={8}><Field name="streetAddress['city']" className={formClasses.editForm} component={renderTextField}/></Grid> :
										<Grid item xs={8}>{publisher.streetAddress.city}</Grid>
									}
								</Grid>
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								<Grid container>
									<Grid item xs={4}>Zip:</Grid>
									{isEdit ?
										<Grid item xs={8}><Field name="streetAddress['zip']" className={formClasses.editForm} component={renderTextField}/></Grid> :
										<Grid item xs={8}>{publisher.streetAddress.zip}</Grid>
									}
								</Grid>
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								<Grid container>
									<Grid item xs={4}>Primary Contact:</Grid>
									{isEdit ?
										<Grid item xs={8}><Field name="primaryContact" className={formClasses.editForm} component={renderTextField}/></Grid> :
										<Grid item xs={8}>{publisher.primaryContact && publisher.primaryContact.map(item => {
											return (
												<Chip key={item} label={item}/>
											);
										})}
										</Grid>}
								</Grid>
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								{isEdit ?
									null :
									<Grid container>
										<Grid item xs={4}>Notes:</Grid>
										<Grid item xs={8}>{publisher.notes.map(item => {
											return (
												<ExpansionPanel key={item}>
													<ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
														<Typography className={classes.heading}>Expansion Panel 1</Typography>
													</ExpansionPanelSummary>
													<ExpansionPanelDetails>
														<Paper className={classes.notesContainer}>
															{item}
														</Paper>
													</ExpansionPanelDetails>
												</ExpansionPanel>
											);
										})}
										</Grid>
									</Grid>}
							</ListItemText>
						</ListItem>
					</List>
				</Grid>
			</>
		);
	}

	const handlePublisherUpdate = values => {
		const {_id, ...updateValues} = values;
		const token = cookie['login-cookie'];
		// eslint-disable-next-line no-undef
		updatePublisher({API_URL: API_URL}, match.params.id, updateValues, token);
		setIsEdit(false);
	};

	const component = (
		<ModalLayout isTableRow color="primary" label="Publisher Detail">
			{isEdit ?
				<div className={classes.publisher}>
					<form>
						<Grid container spacing={3} className={classes.publisherSpinner}>
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
				<div className={classes.publisher}>
					<Grid container spacing={3} className={classes.publisherSpinner}>
						{publisherDetail}
					</Grid>
					{isAuthenticated && userInfo.role.some(item => item === 'publisher') &&
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
