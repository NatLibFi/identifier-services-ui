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
	Grid,
	List,
	ListItem,
	ListItemText,
	Fab,
	Button
} from '@material-ui/core';
import {useCookies} from 'react-cookie';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import {FormattedMessage} from 'react-intl';

import {commonStyles} from '../../styles/app';
import useFormStyles from '../../styles/form';
import * as actions from '../../store/actions';
import ModalLayout from '../ModalLayout';
import renderTextArea from '../form/render/renderTextArea';
import renderTextField from '../form/render/renderTextField';
import Spinner from '../Spinner';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'messageTemplate',
	enableReinitialize: true
})(props => {
	const {id, fetchMessage, messageInfo, handleSubmit, updateMessageTemplate} = props;
	const classes = commonStyles();
	const formClasses = useFormStyles();
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		const token = cookie[COOKIE_NAME];
		if (id !== null) {
			fetchMessage(id, token);
		}
	}, [cookie, fetchMessage, isEdit, id]);

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	function handleMessageUpdate(values) {
		const {_id, ...updateValue} = {
			...values,
			body: Buffer.from(values.body).toString('base64')
		};
		updateMessageTemplate(id, updateValue, cookie[COOKIE_NAME]);
		setIsEdit(false);
	}

	let messageDetail;
	if (messageInfo === null) {
		messageDetail = <Spinner/>;
	} else {
		messageDetail = (
			<>
				{isEdit ?
					<Grid item xs={12} md={12}>
						<List>
							<ListItem>
								<ListItemText>
									<Grid container>
										<Grid item xs={4}>
											<FormattedMessage id="messageTemplate.label.subject"/>
										</Grid>
										<Grid item xs={8}><Field name="subject" className={formClasses.editForm} component={renderTextField}/></Grid>
									</Grid>
									<Grid container>
										<Grid item xs={4}>
											<FormattedMessage id="messageTemplate.label.body"/>
										</Grid>
										<Grid item xs={8}><Field name="body" className={formClasses.editForm} component={renderTextArea} props={{encoded: true}}/></Grid>
									</Grid>
								</ListItemText>
							</ListItem>
						</List>
					</Grid> :
					<Grid item xs={12} md={12}>
						<List>
							<ListItem>
								<ListItemText>
									<Grid container>
										<>
											<Grid item xs={4}>
												<FormattedMessage id="messageTemplate.label.subject"/>:
											</Grid>
											<Grid item xs={8}>{messageInfo.subject}</Grid>
										</>
									</Grid>
									<hr/>
									<Grid container>
										<>
											<Grid item xs={4}>
												<FormattedMessage id="messageTemplate.label.message"/>
											</Grid>
											<Grid item xs={8}>{Buffer.from(messageInfo.body, 'base64').toString('utf8')}</Grid>
										</>
									</Grid>
								</ListItemText>
							</ListItem>
						</List>
					</Grid>}
			</>
		);
	}

	const component = (
		<ModalLayout isTableRow color="primary" title="Message Detail" {...props}>
			{isEdit ?
				<div className={classes.listItem}>
					<form>
						<Grid container spacing={3} className={classes.listItemSpinner}>
							{messageDetail}
						</Grid>
						<div className={classes.btnContainer}>
							<Button onClick={handleCancel}>Cancel</Button>
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit(handleMessageUpdate)}
							>
								UPDATE
							</Button>
						</div>
					</form>
				</div> :
				<div className={classes.listItem}>
					<Grid container spacing={3} className={classes.listItemSpinner}>
						{messageDetail}
					</Grid>
					<div className={classes.btnContainer}>
						<Fab
							color="primary"
							size="small"
							title="Edit Publisher Detail"
							onClick={handleEditClick}
						>
							<EditIcon/>
						</Fab>
					</div>
				</div>}
		</ModalLayout>
	);
	return {
		...component
	};
}));

function mapStateToProps(state) {
	return ({
		loading: state.contact.loading,
		messageInfo: state.contact.messageInfo,
		initialValues: {...state.contact.messageInfo, body: state.contact.messageInfo && Buffer.from(state.contact.messageInfo.body, 'base64').toString('utf8')}
	});
}
