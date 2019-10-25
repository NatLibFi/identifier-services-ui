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

import * as actions from '../../../store/actions';
import PublicationListRenderComponent from '../PublicationListRenderComponent';

export default connect(mapStateToProps, actions)(props => {
	const {fetchIssnList, issnList, loading} = props;
	const [cookie] = useCookies('login-cookie');
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	const [modal, setModal] = useState(false);
	const [issnId, setIssnId] = useState(null);
	const [rowSelectedId, setRowSelectedId] = useState(null);

	useEffect(() => {
		fetchIssnList({token: cookie['login-cookie'], offset: lastCursor});
	}, [lastCursor, cursors, fetchIssnList, cookie]);

	const handleTableRowClick = id => {
		setIssnId(id);
		setModal(true);
		setRowSelectedId(id);
	};

	const headRows = [
		{id: 'title', label: 'Title'},
		{id: 'state', label: 'State'},
		{id: 'frequency', label: 'Frequency'},
		{id: 'firstNumber', label: 'First Number'}
	];

	return (
		<PublicationListRenderComponent
			issn
			loading={loading}
			headRows={headRows}
			handleTableRowClick={handleTableRowClick}
			rowSelectedId={rowSelectedId}
			cursors={setLastCursor}
			publicationList={issnList}
			setLastCursor={setLastCursor}
			id={issnId}
			modal={modal}
			setModal={setModal}
			{...props}
		/>
	);
});

function mapStateToProps(state) {
	return ({
		loading: state.publication.listLoading,
		issnList: state.publication.issnList,
		totalpublication: state.publication.totalDoc,
		offset: state.publication.offset,
		queryDocCount: state.publication.queryDocCount
	});
}
