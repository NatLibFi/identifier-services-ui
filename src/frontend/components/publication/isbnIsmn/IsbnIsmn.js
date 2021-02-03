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
import {useIntl, FormattedMessage} from 'react-intl';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import {commonStyles} from '../../../styles/app';
import * as actions from '../../../store/actions';
import PublicationRenderComponent from '../PublicationRenderComponent';
import RichTextEditor from './RichTextEditor';
import SelectPublicationIdentifierRange from './SelectIsbnIsmnIdentifierRange';
import {isbnClassificationCodes} from '../../form/publisherRegistrationForm/formFieldVariable';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'isbnIsmnUpdateForm',
	validate,
	enableReinitialize: true
})(props => {
	const {
		isbnIsmn,
		userInfo,
		fetchIsbnIsmn,
		handleSubmit,
		sendMessage,
		clearFields,
		updatePublicationIsbnIsmn,
		updatedIsbnIsmn,
		fetchPublisherOption,
		fetchAllMessagesList,
		fetchMessage,
		publisherOption,
		messageTemplates,
		messageInfo,
		match,
		createIsbnIsmnBatch
	} = props;
	const {id} = match.params;
	const intl = useIntl();
	const classes = commonStyles();
	const {role} = userInfo;
	const [isEdit, setIsEdit] = useState(false);
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [assignRange, setAssignRange] = useState(false);
	const [subRangeId, setSubRangeId] = useState(null);
	const [publisherId, setPublisherId] = useState(null);
	const [disableAssign, setDisableAssign] = useState(true);
	const [sendingMessage, setSendingMessage] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [messageToBeSend, setMessageToBeSend] = useState(null);
	const [publisherEmail, setPublisherEmail] = useState(null);
	const [next, setNext] = useState(false);

	useEffect(() => {
		if (id !== null) {
			fetchIsbnIsmn({id: id, token: cookie[COOKIE_NAME]});
			fetchPublisherOption({token: cookie[COOKIE_NAME]});
		}
	}, [cookie, fetchIsbnIsmn, fetchPublisherOption, id, updatedIsbnIsmn, isEdit]);

	useEffect(() => {
		fetchAllMessagesList(cookie[COOKIE_NAME]);
	}, [cookie, fetchAllMessagesList]);

	useEffect(() => {
		if (Object.keys(isbnIsmn).length > 0) {
			if (isbnIsmn.identifier && isbnIsmn.identifier.length > 0) {
				setDisableAssign(true);
			} else {
				setDisableAssign(false);
			}
		}
	}, [isbnIsmn]);

	useEffect(() => {
		if (subRangeId !== null && publisherId !== null) {
			createIsbnIsmnBatch({id: subRangeId, publisherId, isbnIsmn}, cookie[COOKIE_NAME]);
			setSubRangeId(null);
			setPublisherId(null);
		}
	}, [cookie, createIsbnIsmnBatch, fetchIsbnIsmn, id, isbnIsmn, publisherId, subRangeId]);

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
		const {_id, authorFamilyName, authorGivenName, roles, ...rest} = values;
		const updateValues = {
			...rest,
			authors: formatAuthorsValue(isbnIsmn.authors, values.authors),
			isbnClassification: values.isbnClassification ? values.isbnClassification.map(item => item.value.toString()) : []
		};
		const token = cookie[COOKIE_NAME];
		updatePublicationIsbnIsmn(id, updateValues, token);
		setIsEdit(false);
	};

	function formatAuthorsValue(oldValue, newValue) {
		if (newValue !== undefined) {
			const value = newValue.map(item => ({
				givenName: item.authorGivenName ? item.authorGivenName : '',
				familyName: item.authorFamilyName ? item.authorFamilyName : '',
				role: item.role && item.role
			}));
			return value;
		}

		return oldValue;
	}

	function handleOnClickSendMessage() {
		setSendingMessage(true);
	}

	function handleOnClickSend() {
		setSendingMessage(false);
		sendMessage({...messageToBeSend, sendTo: publisherEmail});
	}

	function isEditable(key) {
		const nonEditableFields = userInfo.role === 'admin' ?
			['lastUpdated', '_id', 'associatedRange', 'identifier', 'metadataReference', 'request', 'associatedRange', 'type', 'format'] :
			(userInfo.role === 'publisher-admin' ?
				['lastUpdated', '_id', 'associatedRange', 'identifier', 'metadataReference', 'request', 'associatedRange', 'type', 'format'] :
				[]);

		return isEdit && !nonEditableFields.includes(key);
	}

	function handleRange() {
		setAssignRange(!assignRange);
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
										isbnIsmn
										publication={isbnIsmn}
										setPublisherEmail={setPublisherEmail}
										isEdit={isEdit}
										clearFields={clearFields} isEditable={isEditable}
									/>
								</Grid>
							</form>
						</div> :
						(assignRange ?
							<div className={classes.listItem}>
								{
									publisherId ?
										<Button
											variant="outlined"
											endIcon={<ArrowForwardIosIcon/>}
											onClick={handleRange}
										>
											<FormattedMessage id="form.button.label.next"/>
										</Button> :
										(
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
										)
								}
								<SelectPublicationIdentifierRange
									isbnIsmn={isbnIsmn}
									rangeType="subRange"
									setSubRangeId={setSubRangeId}
									setPublisherId={setPublisherId}
									handleRange={handleRange}
									publisherOption={publisherOption}
									next={next}
									setNext={setNext}
									{...props}
								/>
							</div> :
							<div className={classes.listItem}>
								{role !== undefined && role === 'admin' &&
									<div className={classes.btnContainer}>
										<Grid item xs={12}>
											{
												(subRangeId === null || subRangeId === undefined) &&
													<Button disabled={disableAssign} variant="outlined" color="primary" onClick={handleRange}>
														<FormattedMessage id="publicationRequestRender.button.label.assignRanges"/>
													</Button>
											}
											{
												isbnIsmn.associatedRange && Object.keys(isbnIsmn.associatedRange).length > 0 &&
													<Button variant="outlined" color="primary" onClick={handleOnClickSendMessage}>
														<FormattedMessage id="publicationRequestRender.button.label.sendMessage"/>
													</Button>
											}
										</Grid>
										<Fab
											color="primary"
											size="small"
											title={intl.formatMessage({id: 'publication.isbnismn.edit.label'})}
											onClick={handleEditClick}
										>
											<EditIcon/>
										</Fab>
									</div>}
								<Grid container spacing={3} className={classes.listItemSpinner}>
									<PublicationRenderComponent
										isbnIsmn
										publication={isbnIsmn}
										setPublisherEmail={setPublisherEmail}
										isEdit={isEdit} clearFields={clearFields}
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
			<Grid className={classes.listItem}>
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
		isbnIsmn: state.publication.isbnIsmn,
		initialValues: formatInitialValues(state.publication.isbnIsmn),
		publisherOption: state.publisher.publisherOptions,
		updatedIsbnIsmn: state.publication.updatedIsbnIsmn,
		userInfo: state.login.userInfo,
		messageListLoading: state.contact.listLoading,
		messageTemplates: state.contact.messagesList,
		messageInfo: state.contact.messageInfo
	});

	function formatInitialValues(values) {
		if (Object.keys(values).length > 0) {
			const formattedValues = {
				...values,
				isbnClassification: values.isbnClassification && values.isbnClassification.map(item => {
					return formatClassificationForEditing(Number(item));
				}),
				authors: values.authors && values.authors.map(item => formatAuthorsForEditing(item))
			};
			return formattedValues;
		}

		function formatClassificationForEditing(v) {
			return isbnClassificationCodes.reduce((acc, k) => {
				if (k.value === v) {
					acc = k;
					return acc;
				}

				return acc;
			}, {});
		}

		function formatAuthorsForEditing(v) {
			return {
				authorGivenName: v.givenName,
				authorFamilyName: v.familyName,
				role: v.role
			};
		}
	}
}
