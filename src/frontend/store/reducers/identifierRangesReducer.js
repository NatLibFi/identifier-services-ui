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

import {
	LOADER,
	RANGE_LIST_LOADER,
	ERROR,
	IDENTIFIER,
	IDR,
	IDR_LIST,
	IDR_ISBN_LIST,
	IDR_ISBN,
	IDR_ISMN_LIST,
	IDR_ISMN,
	IDR_ISSN_LIST,
	IDR_ISSN,
	RANGE_STATISTICS
} from '../actions/types';

const initialState = {
	isbnList: [],
	isbn: {},

	ismnList: [],
	ismn: {},

	issnList: [],
	issn: {},

	identifier: {},

	rangesList: [],
	range: {},
	offset: null,
	totalDoc: null,
	queryDocCount: null,
	rangeListLoading: false,
	loading: false,
	statistics: null,
	error: {}
};

export default function (state = initialState, action) {
	switch (action.type) {
		case LOADER:
			return {
				...state,
				loading: true
			};
		case RANGE_LIST_LOADER:
			return {
				...state,
				rangeListLoading: true
			};
		case IDR_LIST:
			return {
				...state,
				rangesList: action.payload.results,
				offset: action.payload.offset,
				totalDoc: action.payload.totalDoc,
				queryDocCount: action.payload.queryDocCount,
				rangeListLoading: false
			};
		case IDR_ISBN_LIST:
			return {
				...state,
				isbnList: action.payload.results,
				offset: action.payload.offset,
				totalDoc: action.payload.totalDoc,
				queryDocCount: action.payload.queryDocCount,
				rangeListLoading: false
			};
		case IDENTIFIER:
			return {
				...state,
				identifier: action.payload,
				loading: false
			};
		case IDR:
			return {
				...state,
				range: action.payload,
				loading: false
			};
		case IDR_ISBN:
			return {
				...state,
				isbn: action.payload,
				loading: false
			};
		case IDR_ISMN_LIST:
			return {
				...state,
				ismnList: action.payload.results,
				offset: action.payload.offset,
				totalDoc: action.payload.totalDoc,
				queryDocCount: action.payload.queryDocCount,
				rangeListLoading: false
			};
		case IDR_ISMN:
			return {
				...state,
				ismn: action.payload,
				loading: false
			};
		case IDR_ISSN_LIST:
			return {
				...state,
				issnList: action.payload.results,
				offset: action.payload.offset,
				totalDoc: action.payload.totalDoc,
				queryDocCount: action.payload.queryDocCount,
				rangeListLoading: false
			};
		case IDR_ISSN:
			return {
				...state,
				issn: action.payload,
				loading: false
			};
		case RANGE_STATISTICS:
			return {
				...state,
				statistics: action.payload,
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
