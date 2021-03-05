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
import {connect} from 'react-redux';
import {useCookies} from 'react-cookie';
import {Grid, Typography} from '@material-ui/core';
import {useIntl, FormattedMessage} from 'react-intl';

import {commonStyles} from '../../styles/app';
import Template from './Template';
import useModalStyles from '../../styles/formList';
import ModalLayout from '../ModalLayout';
import TableComponent from '../TableComponent';
import * as actions from '../../store/actions';
import Spinner from '../Spinner';
import TemplateCreationForm from '../form/TemplateCreationForm';

export default connect(mapStateToProps, actions)(props => {
	const classes = commonStyles();
	const intl = useIntl();
	const modalClasses = useModalStyles();
	const {loading, fetchTemplatesList, messagesList, totalMessages, queryDocCount, offset} = props;
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [page, setPage] = useState(1);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [modal, setModal] = useState(false);
	const [templateId, setTemplateId] = useState(null);
	const [rowSelectedId, setRowSelectedId] = useState(null);

	useEffect(() => {
		console.log(lastCursor);
		fetchTemplatesList(cookie[COOKIE_NAME], lastCursor);
	}, [lastCursor, cursors, fetchTemplatesList, cookie]);

	const handleTableRowClick = id => {
		setTemplateId(id);
		setModal(true);
		setRowSelectedId(id);
	};

	const headRows = [
		{id: 'name', label: intl.formatMessage({id: 'messageTemplate.label.name'})},
		{id: 'subject', label: intl.formatMessage({id: 'messageTemplate.label.subject'})},
		{id: 'language', label: intl.formatMessage({id: 'messageTemplate.label.language'})}

	];

	let messageData;
	if (loading) {
		messageData = <Spinner/>;
	} else if (messagesList === undefined) {
		messageData = <p><FormattedMessage id="messageList.text.nodata"/></p>;
	} else {
		messageData = (
			<TableComponent
				data={messagesList.map(item => usersDataRender(item))}
				handleTableRowClick={handleTableRowClick}
				rowSelectedId={rowSelectedId}
				headRows={headRows}
				offset={offset}
				cursors={cursors}
				page={page}
				setPage={setPage}
				setLastCursor={setLastCursor}
				totalDoc={totalMessages}
				queryDocCount={queryDocCount}
			/>
		);
	}

	function usersDataRender(item) {
		const {id, name, language, subject} = item;
		return {
			id: id,
			name: name,
			subject: subject,
			language: language
		};
	}

	const component = (
		<Grid item xs={12} className={classes.listSearch}>
			<Typography variant="h5">
				<FormattedMessage id="messageTemplateList.list.heading"/>
			</Typography>
			<ModalLayout
				form
				label={intl.formatMessage({id: 'app.modal.title.newTemplate'})}
				title={intl.formatMessage({id: 'app.modal.title.newTemplate'})}
				name="template"
				variant="outlined"
				classed={modalClasses.button}
				color="primary"
			>
				<TemplateCreationForm {...props}/>
			</ModalLayout>
			{messageData}
			<Template id={templateId} modal={modal} setModal={setModal}/>
		</Grid>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		loading: state.message.listLoading,
		messagesList: state.message.messagesList,
		totalMessages: state.message.totalMessages,
		offset: state.message.offset,
		queryDocCount: state.message.queryDocCount
	});
}
