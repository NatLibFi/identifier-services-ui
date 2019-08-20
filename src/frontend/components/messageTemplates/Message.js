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

import React, {useEffect} from 'react';
import {
	Typography,
	Grid,
	List,
	ListItem,
	ListItemText
} from '@material-ui/core';
import {useCookies} from 'react-cookie';

import useStyles from '../../styles/publisher';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import ModalLayout from '../ModalLayout';

export default connect(mapStateToProps, actions)(props => {
	const {match, fetchMessage, messageInfo, apiURL} = props;
	const classes = useStyles();
	const [cookie] = useCookies('login-cookie');

	useEffect(() => {
		const token = cookie['login-cookie'];
		// eslint-disable-next-line no-unused-expressions
		apiURL !== null && fetchMessage({API_URL: apiURL}, match.params.id, token);
	}, [apiURL, cookie, fetchMessage, match.params.id]);

	let messageDetail;
	messageDetail = (messageInfo !== null &&
		<Grid item xs={12} md={6}>
			<Typography variant="h6">
						Message Detail
			</Typography>
			<List>
				<ListItem>
					<ListItemText>
						<Grid container>
							<>
								<Grid item xs={4}>Message:</Grid>
								<Grid item xs={8}>{messageInfo.body}</Grid>
							</>
						</Grid>
					</ListItemText>
				</ListItem>
			</List>
		</Grid>
	);

	const component = (
		<ModalLayout isTableRow color="primary">
			<div className={classes.publisher}>
				<Grid container spacing={3} className={classes.publisherSpinner}>
					{messageDetail}
				</Grid>
			</div>
		</ModalLayout>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		loading: state.contact.loading,
		messageInfo: state.contact.messageInfo,
		apiURL: state.common.apiURL
	});
}
