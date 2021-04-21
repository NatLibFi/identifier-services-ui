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
import {
	FETCH_MESSAGE,
	FETCH_MESSAGES_LIST,
	FETCH_ALL_MESSAGES_LIST,
	FETCH_TEMPLATE,
	FETCH_TEMPLATES_LIST,
	FETCH_ALL_TEMPLATES_LIST,
	ERROR
} from './types';
import fetch from 'node-fetch';
import HttpStatus from 'http-status';
import {setLoader, setListLoader, setMessage, success, fail} from './commonAction';

export const sendMessage = (values, token) => async dispatch => {
	const response = await fetch('/message', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(values)
	});
	if (response.status === HttpStatus.OK) {
		dispatch(setMessage({color: 'success', msg: 'Message sent successfully.'}));
	}
};

export const createMessageTemplate = (values, token) => async dispatch => {
	dispatch(setLoader());
	const response = await fetch(`${API_URL}/templates`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(values)
	});
	if (response.status === HttpStatus.OK) {
		dispatch(setMessage({color: 'success', msg: 'Message Template created successfully.'}));
	}
};

export const fetchMessagesList = (token, sort) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/messages/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({queries: [{
				query: {}
			}],
			sort: sort})
		});
		const result = await response.json();
		dispatch(success(FETCH_MESSAGES_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchTemplatesList = token => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/templates/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({queries: [{
				query: {}
			}]})
		});
		const result = await response.json();
		dispatch(success(FETCH_TEMPLATES_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchAllMessagessList = token => async dispatch => {
	dispatch(setListLoader());
	try {
		const response = await fetch(`${API_URL}/messages/query/all`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		const result = await response.json();
		dispatch(success(FETCH_ALL_MESSAGES_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchAllTemplatesList = token => async dispatch => {
	dispatch(setListLoader());
	try {
		const response = await fetch(`${API_URL}/templates/query/all`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		const result = await response.json();
		dispatch(success(FETCH_ALL_TEMPLATES_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchMessage = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/messages/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		const result = await response.json();
		dispatch(success(FETCH_MESSAGE, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchMessageTemplate = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/templates/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		const result = await response.json();
		dispatch(success(FETCH_TEMPLATE, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const updateMessageTemplate = (id, values, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/templates/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			body: JSON.stringify(values)
		});
		const result = await response.json();
		dispatch(success(FETCH_TEMPLATE, result.value));
		if (response.status === HttpStatus.OK) {
			dispatch(setMessage({color: 'success', msg: 'Message Updated successfully'}));
		}
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

