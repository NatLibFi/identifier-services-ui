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
	const {fetchIsbnIsmnList, isbnIsmnList, loading} = props;
	const [cookie] = useCookies('login-cookie');
	const [cursors] = useState([]);
	const [lastCursor, setLastCursor] = useState(cursors.length === 0 ? null : cursors[cursors.length - 1]);
	useEffect(() => {
		fetchIsbnIsmnList({token: cookie['login-cookie'], offset: lastCursor});
	}, [lastCursor, cursors, fetchIsbnIsmnList, cookie]);

	const handleTableRowClick = id => {
		props.history.push(`/publication/isbn-ismn/${id}`, {modal: true});
	};

	const headRows = [
		{id: 'title', label: 'Title'},
		{id: 'publisher', label: 'Publisher'},
		{id: 'publicationTime', label: 'Publication Time'},
		{id: 'state', label: 'State'}
	];

	return (
		<PublicationListRenderComponent
			loading={loading}
			headRows={headRows}
			handleTableRowClick={handleTableRowClick}
			cursors={setLastCursor}
			publicationList={isbnIsmnList}
			setLastCursor={setLastCursor}
			{...props}
		/>
	);
});

function mapStateToProps(state) {
	return ({
		loading: state.publication.loading,
		isbnIsmnList: state.publication.isbnIsmnList,
		totalpublication: state.publication.totalDoc,
		offset: state.publication.offset,
		queryDocCount: state.publication.queryDocCount
	});
}
