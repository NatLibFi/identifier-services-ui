
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
	Fab
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';

import useStyles from '../../styles/publisher';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import ModalLayout from '../ModalLayout';
import Spinner from '../Spinner';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'userCreation',
	validate,
	enableReinitialize: true
})(props => {
	const {match, userInfo, loading, isAuthenticated, fetchPublisherRequest, publisherRequest} = props;
	const classes = useStyles();
	const [isEdit, setIsEdit] = useState(false);
	const [cookie] = useCookies('login-cookie');
	useEffect(() => {
		// eslint-disable-next-line no-undef
		fetchPublisherRequest({API_URL: API_URL}, match.params.id, cookie['login-cookie']);
	}, [cookie, fetchPublisherRequest, match.params.id]);

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	let publisherRequestDetail;
	if (publisherRequest === undefined || loading) {
		publisherRequestDetail = <Spinner/>;
	} else {
		publisherRequestDetail = (
			<Grid item xs={12} md={6}>
				<Typography variant="h6">
					Publisher Request Detail
					{publisherRequest.name}
				</Typography>
			</Grid>
		);
	}

	// NOTICE !!! Edit functionality is not done yet

	const component = (
		<ModalLayout isTableRow color="primary" label="Publisher Detail">
			{isEdit ?
				<div className={classes.publisher}>
					<form>
						<Grid container spacing={3} className={classes.publisherSpinner}>
							{publisherRequestDetail}
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
						{publisherRequestDetail}
					</Grid>
					{isAuthenticated && userInfo.role.some(item => item === 'admin') &&
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
		publisherRequest: state.publisher.publisherRequest,
		loading: state.publisher.loading,
		isAuthenticated: state.login.isAuthenticated,
		userInfo: state.login.userInfo
	});
}
