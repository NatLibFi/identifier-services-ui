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

import {PUBLISHERS_LIST, PUBLISHER, LOADER, ERROR, SEARCH_PUBLISHER, PUBLISHERS_REQUESTS_LIST, PUBLISHER_REQUEST} from '../actions/types';

const initialState = {
	publishersList: [],
	publisher: {},
	searchedPublisher: [],

	publishersRequestsList: [],
	publisherRequest: {},

	offset: null,
	totalDoc: null,
	queryDocCount: null,

	loading: false,
	listLoading: false,
	error: {}
};

export default function (state = initialState, action) {
	switch (action.type) {
		case LOADER:
			return {
				...state,
				loading: true,
				listLoading: true
			};
		case PUBLISHERS_LIST:
			return {
				...state,
				publishersList: action.payload,
				listLoading: false
			};
		case PUBLISHER:
			return {
				...state,
				publisher: action.payload,
				loading: false
			};
		case PUBLISHERS_REQUESTS_LIST:
			return {
				...state,
				publishersRequestsList: action.payload.results,
				offset: action.payload.offset,
				totalDoc: action.payload.totalDoc,
				queryDocCount: action.payload.queryDocCount,
				loading: false
			};
		case PUBLISHER_REQUEST:
			return {
				...state,
				publisherRequest: action.payload,
				loading: false
			};
		case ERROR:
			return {
				...state,
				error: action.payload,
				loading: false
			};
		case SEARCH_PUBLISHER:
			return {
				...state,
				searchedPublisher: action.payload.results,
				offset: action.payload.offset,
				totalDoc: action.payload.totalDoc,
				queryDocCount: action.payload.queryDocCount,
				listLoading: false
			};

		default:
			return state;
	}
}
