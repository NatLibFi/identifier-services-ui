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
import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';

import useStyles from '../../../styles/publisher';
import * as actions from '../../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import ModalLayout from '../../ModalLayout';
import Spinner from '../../Spinner';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userCreation',
	validate,
	enableReinitialize: true
})(props => {
	const {match, isbnIsmn, userInfo, loading, fetchIsbnIsmn} = props;
	const classes = useStyles();
	const {role} = userInfo;
	const [isEdit, setIsEdit] = useState(false);
	const [cookie] = useCookies('login-cookie');

	useEffect(() => {
		// eslint-disable-next-line no-undef
		fetchIsbnIsmn({id: match.params.id, token: cookie['login-cookie']});
	}, [cookie, fetchIsbnIsmn, match.params.id]);

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	let publicationDetail;
	let keys = isEdit ? Object.keys(isbnIsmn).filter(key => key !== 'lastUpdated') : Object.keys(isbnIsmn).map(key => key);
	if (isbnIsmn === undefined || loading) {
		publicationDetail = <Spinner/>;
	} else {
		publicationDetail = (
			<Grid item xs={12}>
				<Typography variant="h6">
						Publication Details
				</Typography>
				<List>
					<Grid container xs={12}>
						{keys.map(key => {
							return (
								<ListItem key={key}>
									<ListItemText>
										{(typeof isbnIsmn[key] === 'object') ?
											(Array.isArray(isbnIsmn[key]) ?
												isbnIsmn[key].map(obj =>
													renderObject(obj)
												) :
												renderObject(isbnIsmn[key])
											) :
											(
												<Grid container>
													<Grid item xs={4}>{key}: </Grid>
													<Grid item xs={8}>{isbnIsmn[key].toString()}</Grid>
												</Grid>
											)
										}
									</ListItemText>
								</ListItem>
							);
						})}
					</Grid>
				</List>
			</Grid>
		);
	}

	function renderObject(obj) {
		return (Object.keys(obj).map(subKey =>
			(
				<Grid key={subKey} container>
					<Grid item xs={4}>{subKey}: </Grid>
					<Grid item xs={8}>{obj[subKey]}</Grid>
				</Grid>
			)
		));
	}

	const component = (
		<ModalLayout isTableRow color="primary">
			{isEdit ?
				<div className={classes.publisher}>
					<form>
						<Grid container spacing={3} className={classes.publisherSpinner}>
							{publicationDetail}
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
						{publicationDetail}
					</Grid>
					{role !== undefined && role.some(item => item === 'admin') &&
						<div className={classes.btnContainer}>
							<Fab
								color="primary"
								size="small"
								title="Edit isbnIsmn Detail"
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
		isbnIsmn: state.publication.isbnIsmn,
		loading: state.publication.loading,
		initialValues: state.publication.isbnIsmn,
		userInfo: state.login.userInfo
	});
}
