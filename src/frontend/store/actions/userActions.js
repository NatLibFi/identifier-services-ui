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
import fetch from 'node-fetch';
import {USERS_LIST, ERROR, USERS_REQUESTS_LIST, FETCH_USER, FETCH_USERS_REQUEST} from './types';
import {setLoader, success, fail} from './commonAction';

export const fetchUsersList = ({API_URL}, token, offset) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/users/query`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				queries: [{
					query: {}
				}],
				offset: offset
			})
		});
		const result = await response.json();
		dispatch(success(USERS_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const createUser = ({API_URL}, values, token) => async () => {
	const response = await fetch(`${API_URL}/users`, {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(values)
	});
	await response.json();
};

export const createUserRequest = ({API_URL}, values, token) => async () => {
	const response = await fetch(`${API_URL}/requests/users`, {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(values)
	});
	await response.json();
};

export const fetchUser = ({API_URL}, id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/users/${id}`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const result = await response.json();
		dispatch(success(FETCH_USER, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchUserRequest = ({API_URL}, id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/requests/users/${id}`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const result = await response.json();
		dispatch(success(FETCH_USERS_REQUEST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchUsersRequestsList = ({API_URL, inputVal, sortStateBy, token, offset}) => async dispatch => {
	dispatch(setLoader());
	try {
		const properties = {
			method: 'POST',
			headers: token ? {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			} :
				{'Content-Type': 'application/json'},
			body: JSON.stringify({
				queries: [{
					query: {state: sortStateBy, publisher: inputVal}
				}],
				offset: offset
			})
		};
		const response = await fetch(`${API_URL}/requests/users/query`, properties);
		const result = await response.json();
		dispatch(success(USERS_REQUESTS_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const updateUserRequest = ({API_URL}, id, values, token) => async () => {
	const response = await fetch(`${API_URL}/requests/users/${id}`, {
		method: 'PUT',
		headers: {
			Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(values)
	});
	console.log(await response.json());
};
