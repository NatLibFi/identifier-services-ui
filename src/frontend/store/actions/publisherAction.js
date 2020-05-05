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

/* global API_URL */
/* eslint no-undef: "error" */
import fetch from 'node-fetch';
import {PUBLISHER, ERROR, SEARCH_PUBLISHER, PUBLISHERS_REQUESTS_LIST, PUBLISHER_REQUEST, UNIVERSITY_PUBLISHER} from './types';
import {setLoader, setListLoader, setMessage, success, fail} from './commonAction';
import HttpStatus from 'http-status';

export const findPublisherIdByEmail = ({email, token, offset}) => async dispatch => {
	dispatch(setLoader());
	try {
		const properties = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				queries: [{
					query: {publisherEmail: email}
				}],
				offset: offset
			})
		};

		const response = await fetch(`${API_URL}/publishers/query`, properties);
		const result = await response.json();
		if (result.results.length > 0) {
			return result.results[0].id;
		}

		dispatch(setMessage({color: 'error', msg: 'Publisher Admin with this email doesnot exist'}));
		return HttpStatus.NOT_FOUND;
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchPublisher = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/publishers/${id}`, {
			method: 'GET',
			headers: token ? {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			} :
				{'Content-Type': 'application/json'}
		});
		const result = await response.json();
		dispatch(success(PUBLISHER, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const updatePublisher = (id, values, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/publishers/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			body: JSON.stringify(values)
		});
		const result = await response.json();
		dispatch(success(PUBLISHER, result.value));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const searchPublisher = ({searchText, token, offset, activeCheck}) => async dispatch => {
	dispatch(setListLoader());
	const query = (activeCheck !== undefined && activeCheck.checked === true) ? {$or: [{name: searchText}, {aliases: searchText}, {publisherEmail: searchText}], activity: {active: true}} :
		{$or: [{name: searchText}, {aliases: searchText}, {publisherEmail: searchText}]};

	try {
		const properties = {
			method: 'POST',
			headers: token ? {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			} :
				{'Content-Type': 'application/json'},
			body: JSON.stringify({
				queries: [{
					query: query
				}],
				offset: offset
			})
		};

		const response = await fetch(`${API_URL}/publishers/query`, properties);

		const result = await response.json();
		dispatch(success(SEARCH_PUBLISHER, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const getUniversityPublisher = () => async dispatch => {
	dispatch(setListLoader());
	const query = {type: 'university'};
	try {
		const response = await fetch(`${API_URL}/publishers/query`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				queries: [{
					query: query
				}]
			})
		});
		const result = await response.json();
		dispatch(success(UNIVERSITY_PUBLISHER, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

// ****************REQUESTS**********************************
export const publisherCreationRequest = values => async dispatch => {
	const response = await fetch('/requests/publishers', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(values)
	});
	if (response.status === HttpStatus.CREATED) {
		dispatch(setMessage({color: 'success', msg: 'Registration request sent successfully'}));
	}

	return response.status;
};

export const fetchPublishersRequestsList = ({searchText, token, sortStateBy, offset}) => async dispatch => {
	dispatch(setListLoader());
	try {
		const response = await fetch(`${API_URL}/requests/publishers/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				queries: [{
					query: {state: sortStateBy, name: searchText}
				}],
				offset: offset
			})
		});
		const result = await response.json();
		dispatch(success(PUBLISHERS_REQUESTS_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchPublisherRequest = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/requests/publishers/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();
		dispatch(success(PUBLISHER_REQUEST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const updatePublisherRequest = (id, values, token) => async dispatch => {
	dispatch(setLoader());
	try {
		delete values.backgroundProcessingState;
		const response = await fetch(`${API_URL}/requests/publishers/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			body: JSON.stringify(values)
		});
		const result = await response.json();
		dispatch(success(PUBLISHER_REQUEST, result.value));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};
