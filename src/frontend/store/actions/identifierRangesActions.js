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
import fetch from 'node-fetch';
import {ERROR, IDR_ISBN_LIST, IDR_ISBN, IDR_ISMN_LIST, IDR_ISMN, IDR_ISSN_LIST, IDR_ISSN} from './types';
import {setLoader, setRangeListLoader, success, fail, setMessage} from './commonAction';
import HttpStatus from 'http-status';

// ***************ISBN****************************

export const fetchIDRIsbnList = ({searchText, token, offset, activeCheck}) => async dispatch => {
	dispatch(setRangeListLoader());
	const query = (activeCheck !== undefined && activeCheck.checked === true) ? {prefix: searchText, active: true} :
		{prefix: searchText};

	try {
		const response = await fetch(`${API_URL}/ranges/isbn/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				queries: [{
					query: query
				}],
				offset: offset
			})
		});
		const result = await response.json();
		dispatch(success(IDR_ISBN_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchIDRIsbn = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/ranges/isbn/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();
		dispatch(success(IDR_ISBN, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const updateIsbnRange = (id, values, token) => async dispatch => {
	dispatch(setRangeListLoader());

	try {
		const response = await fetch(`${API_URL}/ranges/isbn/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(values)
		});
		const result = await response.json();
		dispatch(success(IDR_ISBN, result.value));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const createIsbnRange = (values, token) => async dispatch => {
	const response = await fetch(`${API_URL}/ranges/isbn`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(values)
	});
	if (response.status === HttpStatus.CREATED) {
		dispatch(setMessage({color: 'success', msg: 'ISBN range created successfully'}));
		return response.status;
	}

	if (response.status === HttpStatus.CONFLICT) {
		dispatch(setMessage({color: 'error', msg: 'Range already exists'}));
		return response.status;
	}

	dispatch(setMessage({color: 'error', msg: 'There is a problem creating ISbN range'}));
	return response.status;
};

// ***************ISMN****************************

export const fetchIDRIsmnList = ({searchText, token, offset, activeCheck}) => async dispatch => {
	dispatch(setRangeListLoader());
	const query = (activeCheck !== undefined && activeCheck.checked === true) ? {prefix: searchText, active: true} :
		{prefix: searchText};

	try {
		const response = await fetch(`${API_URL}/ranges/ismn/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				queries: [{
					query: query
				}],
				offset: offset
			})
		});
		const result = await response.json();
		dispatch(success(IDR_ISMN_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchIDRIsmn = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/ranges/ismn/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();
		dispatch(success(IDR_ISMN, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const updateIsmnRange = (id, values, token) => async dispatch => {
	dispatch(setRangeListLoader());

	try {
		const response = await fetch(`${API_URL}/ranges/ismn/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(values)
		});
		const result = await response.json();
		dispatch(success(IDR_ISMN, result.value));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const createIsmnRange = (values, token) => async dispatch => {
	const response = await fetch(`${API_URL}/ranges/ismn`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(values)
	});
	if (response.status === HttpStatus.CREATED) {
		dispatch(setMessage({color: 'success', msg: 'ISMN range created successfully'}));
		return response.status;
	}

	if (response.status === HttpStatus.CONFLICT) {
		dispatch(setMessage({color: 'error', msg: 'Range already exists'}));
		return response.status;
	}

	dispatch(setMessage({color: 'error', msg: 'There is a problem creating ISMN range'}));
	return response.status;
};
// ***************ISSN****************************

export const fetchIDRIssnList = ({searchText, token, offset, activeCheck}) => async dispatch => {
	dispatch(setRangeListLoader());
	const query = (activeCheck !== undefined && activeCheck.checked === true) ? {prefix: searchText, active: true} :
		{prefix: searchText};

	try {
		const response = await fetch(`${API_URL}/ranges/issn/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				queries: [{
					query: query
				}],
				offset: offset
			})
		});
		const result = await response.json();
		dispatch(success(IDR_ISSN_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchIDRIssn = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/ranges/issn/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();
		dispatch(success(IDR_ISSN, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const createIssnRange = (values, token) => async dispatch => {
	const response = await fetch(`${API_URL}/ranges/issn`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(values)
	});
	if (response.status === HttpStatus.CREATED) {
		dispatch(setMessage({color: 'success', msg: 'ISSN range created successfully'}));
		return response.status;
	}

	if (response.status === HttpStatus.CONFLICT) {
		dispatch(setMessage({color: 'error', msg: 'Range already exists'}));
		return response.status;
	}

	dispatch(setMessage({color: 'error', msg: 'There is a problem creating ISSN range'}));
	return response.status;
};
