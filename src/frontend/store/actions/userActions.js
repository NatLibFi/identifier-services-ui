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
import {USERS_LIST, ERROR, USERS_REQUESTS_LIST, FETCH_USER, FETCH_USERS_REQUEST} from './types';
import {setLoader, setListLoader, success, setMessage, fail} from './commonAction';
import HttpStatus from 'http-status';

export const fetchUsersList = (token, offset) => async dispatch => {
	dispatch(setListLoader());
	try {
		const response = await fetch(`${API_URL}/users/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
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

export const createUser = (values, token) => async dispatch => {
	const response = await fetch(`${API_URL}/users`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(values)
	});
	switch (response.status) {
		case HttpStatus.OK:
			dispatch(setMessage({color: 'success', msg: 'User created successfully'}));
			return response.status;
		case HttpStatus.NOT_FOUND:
			dispatch(setMessage({color: 'error', msg: 'SSO-ID doesnot exists in crowd'}));
			return response.status;
		case HttpStatus.CONFLICT:
			dispatch(setMessage({color: 'error', msg: 'User with this SSO-ID or email already exists'}));
			return response.status;
		default:
			return null;
	}
};

export const createUserRequest = (values, token) => async dispatch => {
	const response = await fetch(`${API_URL}/requests/users`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(values)
	});

	switch (response.status) {
		case HttpStatus.OK:
			dispatch(setMessage({color: 'success', msg: 'Registration request sent successfully'}));
			return response.status;
		case HttpStatus.NOT_FOUND:
			dispatch(setMessage({color: 'error', msg: 'SSO-ID doesnot exists in crowd'}));
			return response.status;
		case HttpStatus.CONFLICT:
			dispatch(setMessage({color: 'error', msg: 'Request with this SSO-ID or email already exists'}));
			return response.status;
		default:
			return null;
	}
};

export const fetchUser = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/users/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		const result = await response.json();
		dispatch(success(FETCH_USER, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchUserRequest = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/requests/users/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		const result = await response.json();
		dispatch(success(FETCH_USERS_REQUEST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchUsersRequestsList = ({searchText, sortStateBy, token, offset}) => async dispatch => {
	dispatch(setListLoader());
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
					query: {state: sortStateBy, $or: [{publisher: searchText}, {givenName: searchText}]}
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

export const updateUserRequest = (id, values, token) => async dispatch => {
	dispatch(setLoader());
	try {
		delete values.backgroundProcessingState;
		const response = await fetch(`${API_URL}/requests/users/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			body: JSON.stringify(values)
		});
		if (response.status === HttpStatus.OK) {
			const result = await response.json();
			dispatch(success(FETCH_USERS_REQUEST, result.value));
			dispatch(setMessage({color: 'success', msg: 'Record Successfully Updated!!!'}));
			return response.status;
		}
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const deleteUser = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/users/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (response.status === HttpStatus.OK) {
			dispatch(setMessage({color: 'success', msg: 'User Successfully Deleted!!!'}));
			return response.status;
		}
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};
