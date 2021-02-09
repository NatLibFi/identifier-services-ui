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
import Select from 'react-select';
import EditIcon from '@material-ui/icons/Edit';
import {reduxForm} from 'redux-form';
import {useCookies} from 'react-cookie';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import {FormattedMessage, useIntl} from 'react-intl';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import RichTextEditor from '../isbnIsmn/RichTextEditor';
import {commonStyles} from '../../../styles/app';
import * as actions from '../../../store/actions';
import PublicationRenderComponent from '../PublicationRenderComponent';
import SelectPublicationIdentifierRange from './SelectIssnIdentifierRange';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'issnUpdateForm',
	validate,
	enableReinitialize: true
})(props => {
	const {
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
		match,
		history,
		assignIssnRange,
		messageInfo
	} = props;
	const {id} = match.params;
	const intl = useIntl();
	const classes = commonStyles();
	const {role} = userInfo;
	const [isEdit, setIsEdit] = useState(false);
	const [disableAssign, setDisableAssign] = useState(true);
	const [assignRange, setAssignRange] = useState(false);
	const [publisherEmail, setPublisherEmail] = useState(null);
	const [sendingMessage, setSendingMessage] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [messageToBeSend, setMessageToBeSend] = useState(null);
	const [rangeBlockId, setRangeBlockId] = useState(null);
	const [next, setNext] = useState(false);

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

	useEffect(() => {
		if (Object.keys(issn).length > 0) {
			if (issn.identifier && issn.identifier.length > 0) {
				setDisableAssign(true);
			} else {
				setDisableAssign(false);
			}
		}
	}, [issn]);

	useEffect(() => {
		if (rangeBlockId !== null) {
			assignIssnRange({rangeBlockId, issn}, cookie[COOKIE_NAME]);
		}
	}, [assignIssnRange, cookie, issn, rangeBlockId]);

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	const handlePublicationUpdate = values => {
		const {_id, ...updateValues} = values;
		const token = cookie[COOKIE_NAME];
		updatePublicationIssn(id, updateValues, token);
		setIsEdit(false);
		history.push('/publications/issn');
	};

	function handleOnClickSendMessage() {
		setSendingMessage(true);
	}

	function handleOnClickSend() {
		setSendingMessage(false);
		sendMessage({...messageToBeSend, sendTo: publisherEmail});
	}

	function handleRange() {
		setAssignRange(!assignRange);
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
		<Grid item xs={12}>
			{ sendingMessage ?
				messageElement() :
				(
					isEdit ?
						<div className={classes.listItem}>
							<form>
								<div className={classes.btnContainer}>
									<Button onClick={handleCancel}>
										<FormattedMessage id="form.button.label.cancel"/>
									</Button>
									<Button variant="contained" color="primary" onClick={handleSubmit(handlePublicationUpdate)}>
										<FormattedMessage id="form.button.label.update"/>
									</Button>
								</div>
								<Grid container spacing={3} className={classes.listItemSpinner}>
									<PublicationRenderComponent
										issn
										publication={issn}
										setPublisherEmail={setPublisherEmail}
										isEdit={isEdit}
										clearFields={clearFields}
										isEditable={isEditable}
									/>
								</Grid>
							</form>
						</div> :
						(
							assignRange ?
								<div className={classes.listItem}>
									{
										next ?
											<Button
												variant="outlined"
												endIcon={<ArrowForwardIosIcon/>}
												onClick={() => setNext(false)}
											>
												<FormattedMessage id="form.button.label.next"/>
											</Button> :
											<Button
												variant="outlined"
												startIcon={<ArrowBackIosIcon/>}
												onClick={handleRange}
											>
												<FormattedMessage id="form.button.label.back"/>
											</Button>

									}
									<SelectPublicationIdentifierRange
										issn={issn}
										handleRange={handleRange}
										setRangeBlockId={setRangeBlockId}
										{...props}
									/>
								</div> :
								<div className={classes.listItem}>
									{role !== undefined && role === 'admin' &&
										<div className={classes.btnContainer}>
											<Grid item xs={12}>
												{
													<Button disabled={disableAssign} variant="outlined" color="primary" onClick={handleRange}>
														<FormattedMessage id="publicationRequestRender.button.label.assignRanges"/>
													</Button>
												}
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
									<Grid container spacing={3} className={classes.listItemSpinner}>
										<PublicationRenderComponent
											issn
											publication={issn}
											setPublisherEmail={setPublisherEmail}
											isEdit={isEdit}
											clearFields={clearFields}
											isEditable={isEditable}
										/>
									</Grid>
								</div>
						)
				)}
		</Grid>
	);
	return {
		...component
	};

	function messageElement() {
		return (
			<Grid Container className={classes.listItem}>
				<Grid item xs={12}>
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
				</Grid>
				<Grid item xs={12}>
					<Button variant="outlined" color="primary" onClick={() => setSendingMessage(false)}>
						<FormattedMessage id="publicationRequestRender.button.label.cancel"/>
					</Button>
					<Button disabled={messageToBeSend === null || publisherEmail === null} variant="outlined" color="primary" onClick={handleOnClickSend}>
						<FormattedMessage id="publicationRequestRender.button.label.sendMessage"/>
					</Button>
				</Grid>
			</Grid>
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
