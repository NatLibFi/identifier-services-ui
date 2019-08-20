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

import {USERS_LIST, LOADER, ERROR, USERS_REQUESTS_LIST, FETCH_USER, FETCH_USERS_REQUEST} from '../actions/types';

const initialState = {
	usersList: [],
	pageInfo: {},
	totalUsers: null,
	offset: null,
	requestOffset: null,
	usersRequest: {},
	usersRequestsList: [],
	totalUsersRequests: null,
	user: {},
	loading: false,
	error: {}
};

export default function (state = initialState, action) {
	switch (action.type) {
		case LOADER:
			return {
				...state,
				loading: true
			};
		case FETCH_USER:
			return {
				...state,
				user: action.payload,
				loading: false
			};
		case USERS_LIST:
			return {
				...state,
				usersList: action.payload.results,
				offset: action.payload.offset,
				totalUsers: action.payload.totalDoc,
				loading: false
			};
		case USERS_REQUESTS_LIST:
			return {
				...state,
				usersRequestsList: action.payload.results,
				requestOffset: action.payload.offset,
				totalUsersRequests: action.payload.totalDoc,
				loading: false
			};
		case FETCH_USERS_REQUEST:
			return {
				...state,
				usersRequest: action.payload,
				loading: false
			};
		case ERROR:
			return {
				...state,
				error: action.payload,
				loading: false
			};
		default:
			return state;
	}
}
