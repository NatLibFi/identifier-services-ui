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
	Fab
} from '@material-ui/core';
import RichTextEditor from '../isbnIsmn/RichTextEditor';
import Select from 'react-select';
import EditIcon from '@material-ui/icons/Edit';
import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import {FormattedMessage, useIntl} from 'react-intl';

import {commonStyles} from '../../../styles/app';
import * as actions from '../../../store/actions';
import ModalLayout from '../../ModalLayout';
import PublicationRenderComponent from '../PublicationRenderComponent';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'issnUpdateForm',
	validate,
	enableReinitialize: true
})(props => {
	const {
		id,
		issn,
		userInfo,
		fetchIssn,
		handleSubmit,
		sendMessage,
		clearFields,
		updatePublicationIssn,
		updatedIssn,
		fetchAllMessagesList,
		fetchMessage,
		messageTemplates,
		messageInfo
	} = props;
	const intl = useIntl();
	const classes = commonStyles();
	const {role} = userInfo;
	const [isEdit, setIsEdit] = useState(false);
	const [publisherEmail, setPublisherEmail] = useState(null);
	const [sendingMessage, setSendingMessage] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [messageToBeSend, setMessageToBeSend] = useState(null);

	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);

	useEffect(() => {
		if (id !== null) {
			fetchIssn({id: id, token: cookie[COOKIE_NAME]});
		}
	}, [cookie, fetchIssn, id, updatedIssn]);

	useEffect(() => {
		fetchAllMessagesList(cookie[COOKIE_NAME]);
	}, [cookie, fetchAllMessagesList]);

	useEffect(() => {
		if (selectedTemplate !== null) {
			fetchMessage(selectedTemplate.value, cookie[COOKIE_NAME]);
		}
	}, [cookie, fetchMessage, selectedTemplate]);

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	const handlePublicationUpdate = values => {
		const {_id, ...updateValues} = values;
		const token = cookie[COOKIE_NAME];
		console.log(updateValues, token);
		updatePublicationIssn(id, updateValues, token);
		setIsEdit(false);
	};

	function handleOnClickSendMessage() {
		setSendingMessage(true);
	}

	function handleOnClickSend() {
		setSendingMessage(false);
		sendMessage({...messageToBeSend, sendTo: publisherEmail});
	}

	function isEditable(key) {
		const nonEditableFields = userInfo.role === 'admin' ?
			['lastUpdated', '_id', 'associatedRange', 'identifier', 'metadataReference', 'request', 'associatedRange', 'type'] :
			(userInfo.role === 'publisher-admin' ?
				['lastUpdated', '_id', 'associatedRange', 'identifier', 'metadataReference', 'request', 'associatedRange', 'type'] :
				[]);

		return isEdit && !nonEditableFields.includes(key);
	}

	const component = (
		<ModalLayout isTableRow color="primary" title={intl.formatMessage({id: 'app.modal.title.publicationIssn'})} {...props}>
			{ sendingMessage ?
				messageElement() :
				(
					isEdit ?
						<div className={classes.listItem}>
							<form>
								<Grid container spacing={3} className={classes.listItemSpinner}>
									<PublicationRenderComponent publication={issn} setPublisherEmail={setPublisherEmail} isEdit={isEdit} clearFields={clearFields} isEditable={isEditable}/>
								</Grid>
								<div className={classes.btnContainer}>
									<Button onClick={handleCancel}>
										<FormattedMessage id="form.button.label.cancel"/>
									</Button>
									<Button variant="contained" color="primary" onClick={handleSubmit(handlePublicationUpdate)}>
										<FormattedMessage id="form.button.label.update"/>
									</Button>
								</div>
							</form>
						</div> :
						<div className={classes.listItem}>
							<Grid container spacing={3} className={classes.listItemSpinner}>
								<PublicationRenderComponent publication={issn} setPublisherEmail={setPublisherEmail} isEdit={isEdit} clearFields={clearFields} isEditable={isEditable}/>
							</Grid>
							{role !== undefined && role === 'admin' &&
								<div className={classes.btnContainer}>
									<Grid item xs={12}>
										{
											issn.associatedRange && Object.keys(issn.associatedRange).length > 0 &&
												<Button variant="outlined" color="primary" onClick={handleOnClickSendMessage}>
													<FormattedMessage id="publicationRequestRender.button.label.sendMessage"/>
												</Button>
										}
									</Grid>
									<Fab
										color="primary"
										size="small"
										title={intl.formatMessage({id: 'publication.issn.edit.label'})}
										onClick={handleEditClick}
									>
										<EditIcon/>
									</Fab>
								</div>}
						</div>
				)}
		</ModalLayout>
	);
	return {
		...component
	};

	function messageElement() {
		return (
			<div className={classes.listItem}>
				{/* Selectable list of Message Templates */}
				<Select
					isMulti={false}
					options={messageSelectOptions(messageTemplates)}
					placeholder="Select message template from the list"
					value={selectedTemplate}
					onChange={value => setSelectedTemplate(value)}
				/>
				{/* Format and Edit Message */}
				<RichTextEditor messageInfo={messageInfo} setMessageToBeSend={setMessageToBeSend}/>
				<Button disabled={messageToBeSend === null || publisherEmail === null} variant="outlined" color="primary" onClick={handleOnClickSend}>
					<FormattedMessage id="publicationRequestRender.button.label.sendMessage"/>
				</Button>
			</div>
		);
	}

	function messageSelectOptions(templates) {
		if (templates !== undefined) {
			return templates.map(item => ({value: item.value, label: item.label}));
		}
	}
}));

function mapStateToProps(state) {
	return ({
		issn: state.publication.issn,
		initialValues: state.publication.issn,
		userInfo: state.login.userInfo,
		updatedIssn: state.publication.updatedIssn,
		messageListLoading: state.contact.listLoading,
		messageTemplates: state.contact.messagesList,
		messageInfo: state.contact.messageInfo
	});
}
