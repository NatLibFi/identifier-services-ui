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
import {FormattedMessage} from 'react-intl';

import * as actions from '../../../store/actions';
import PublicationListRenderComponent from '../PublicationListRenderComponent';

export default connect(mapStateToProps, actions)(props => {
	const {fetchIsbnIsmnList, isbnIsmnList, history} = props;
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [modal, setModal] = useState(false);
	const [isbnIsmnId, setIsbnIsmnId] = useState(null);
	const [rowSelectedId, setRowSelectedId] = useState(null);
	const [isCreating, setIsCreating] = useState(false);

	useEffect(() => {
		fetchIsbnIsmnList({token: cookie[COOKIE_NAME], offset: lastCursor});
		setIsCreating(false);
	}, [lastCursor, cursors, fetchIsbnIsmnList, cookie, isCreating, modal]);

	const handleTableRowClick = id => {
		setIsbnIsmnId(id);
		// SetModal(true);
		history.push(`/publications/isbn-ismn/${id}`);
		setRowSelectedId(id);
	};

	const headRows = [
		{id: 'title', label: <FormattedMessage id="publicationList.isbnismn.headRows.title"/>},
		{id: 'publicationTime', label: <FormattedMessage id="publicationList.isbnismn.headRows.publicationTime"/>},
		{id: 'state', label: <FormattedMessage id="publicationList.isbnismn.headRows.state"/>}
	];

	return (
		<PublicationListRenderComponent
			// IsbnIsmn
			headRows={headRows}
			handleTableRowClick={handleTableRowClick}
			rowSelectedId={rowSelectedId}
			cursors={cursors}
			publicationList={isbnIsmnList}
			setLastCursor={setLastCursor}
			modal={modal}
			id={isbnIsmnId}
			setModal={setModal}
			setIsCreating={setIsCreating}
			{...props}
		/>
	);
});

function mapStateToProps(state) {
	return ({
		isbnIsmnList: state.publication.isbnIsmnList,
		totalpublication: state.publication.totalDoc,
		offset: state.publication.offset,
		queryDocCount: state.publication.queryDocCount,
		role: state.login.userInfo.role
	});
}
