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
import ModalLayout from '../../ModalLayout';
import PublicationRenderComponent from '../PublicationRenderComponent';
import RichTextEditor from './RichTextEditor';
import SelectPublicationIdentifierRange from './SelectPublicationIdentifierRange';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'isbnIsmnUpdateForm',
	validate,
	enableReinitialize: true
})(props => {
	const {id,
		isbnIsmn,
		userInfo,
		fetchIsbnIsmn,
		handleSubmit,
		clearFields,
		updatePublicationIsbnIsmn,
		updatedIsbnIsmn,
		fetchPublisherOption,
		fetchAllMessagesList,
		publisherOption,
		messageTemplates,
		createIsbnIsmnBatch
	} = props;
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

	useEffect(() => {
		if (id !== null) {
			fetchIsbnIsmn({id: id, token: cookie[COOKIE_NAME]});
			fetchPublisherOption({token: cookie[COOKIE_NAME]});
		}
	}, [cookie, fetchIsbnIsmn, fetchPublisherOption, id, updatedIsbnIsmn]);

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

	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	const handlePublicationUpdate = values => {
		const {_id, ...updateValues} = values;
		const token = cookie[COOKIE_NAME];
		updatePublicationIsbnIsmn(id, updateValues, token);
		setIsEdit(false);
	};

	function handleOnClickSendMessage() {
		setSendingMessage(true);
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

	function handleCloseModal() {
		setAssignRange(false);
		setIsEdit(false);
		setSendingMessage(false);
	}

	const component = (
		<ModalLayout
			isTableRow
			color="primary"
			title={intl.formatMessage({id: 'app.modal.title.publicationIsbnIsmn'})}
			handleCloseModal={handleCloseModal}
			{...props}
		>
			{ sendingMessage ?
				messageElement() :
				(
					isEdit ?
						<div className={classes.listItem}>
							<form>
								<Grid container spacing={3} className={classes.listItemSpinner}>
									<PublicationRenderComponent publication={isbnIsmn} isEdit={isEdit} clearFields={clearFields} isEditable={isEditable}/>
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
						(assignRange ?
							<div className={classes.listItem}>
								<SelectPublicationIdentifierRange
									isbnIsmn={isbnIsmn}
									rangeType="subRange"
									setSubRangeId={setSubRangeId}
									setPublisherId={setPublisherId}
									handleRange={handleRange}
									publisherOption={publisherOption}
									{...props}
								/>
								{
									publisherId ?
										<Button
											variant="outlined"
											endIcon={<ArrowForwardIosIcon/>}
											onClick={handleRange}
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
							</div> :
							<div className={classes.listItem}>
								<Grid container spacing={3} className={classes.listItemSpinner}>
									<PublicationRenderComponent publication={isbnIsmn} isEdit={isEdit} clearFields={clearFields} isEditable={isEditable}/>
								</Grid>
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
							</div>
						)
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
					onBlur={value => setSelectedTemplate(value)}
					onChange={value => setSelectedTemplate(value)}
				/>
				{/* Format and Edit Message */}
				<RichTextEditor/>
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
		isbnIsmn: state.publication.isbnIsmn,
		loading: state.publication.loading,
		initialValues: state.publication.isbnIsmn,
		publisherOption: state.publisher.publisherOptions,
		updatedIsbnIsmn: state.publication.updatedIsbnIsmn,
		userInfo: state.login.userInfo,
		messageListLoading: state.contact.listLoading,
		messageTemplates: state.contact.messagesList
	});
}
