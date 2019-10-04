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
import {
	ISBN_ISMN_LIST,
	FETCH_ISBN_ISMN,
	ISSN_LIST,
	FETCH_ISSN,
	ERROR,
	PUBLICATIONISBNISMN_REQUESTS_LIST,
	PUBLICATION_ISBN_ISMN_REQUEST
} from './types';
import {setLoader, success, fail, setMessage} from './commonAction';

export const fetchIsbnIsmnList = ({token, offset}) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/publications/isbn-ismn/query`, {
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
		dispatch(success(ISBN_ISMN_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchIssnList = ({token, offset}) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/publications/issn/query`, {
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
		dispatch(success(ISSN_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

// Export const createUser = (values, token) => async () => {
// 	const response = await fetch(`${API_URL}/users`, {
// 		method: 'POST',
// 		headers: {
// 			Authorization: 'Bearer ' + token,
// 			'Content-Type': 'application/json'
// 		},
// 		credentials: 'same-origin',
// 		body: JSON.stringify(values)
// 	});
// 	await response.json();
// };

// Export const createUserRequest = (values, token) => async () => {
// 	const response = await fetch(`${API_URL}/requests/users`, {
// 		method: 'POST',
// 		headers: {
// 			Authorization: 'Bearer ' + token,
// 			'Content-Type': 'application/json'
// 		},
// 		credentials: 'same-origin',
// 		body: JSON.stringify(values)
// 	});
// 	await response.json();
// };

export const fetchIsbnIsmn = ({id, token}) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/publications/isbn-ismn/${id}`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const result = await response.json();
		dispatch(success(FETCH_ISBN_ISMN, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchIssn = ({id, token}) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/publications/issn/${id}`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const result = await response.json();
		dispatch(success(FETCH_ISSN, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

// Export const fetchUserRequest = (id, token) => async dispatch => {
// 	dispatch(setLoader());
// 	try {
// 		const response = await fetch(`${API_URL}/requests/users/${id}`, {
// 			method: 'GET',
// 			headers: {
// 				Authorization: 'Bearer ' + token
// 			}
// 		});
// 		const result = await response.json();
// 		dispatch(success(FETCH_USERS_REQUEST, result));
// 	} catch (err) {
// 		dispatch(fail(ERROR, err));
// 	}
// };

// export const fetchUsersRequestsList = ({inputVal, sortStateBy, token, offset}) => async dispatch => {
// 	dispatch(setLoader());
// 	try {
// 		const properties = {
// 			method: 'POST',
// 			headers: token ? {
// 				Authorization: 'Bearer ' + token,
// 				'Content-Type': 'application/json'
// 			} :
// 				{'Content-Type': 'application/json'},
// 			body: JSON.stringify({
// 				queries: [{
// 					query: {state: sortStateBy, publisher: inputVal}
// 				}],
// 				offset: offset
// 			})
// 		};
// 		const response = await fetch(`${API_URL}/requests/users/query`, properties);
// 		const result = await response.json();
// 		dispatch(success(USERS_REQUESTS_LIST, result));
// 	} catch (err) {
// 		dispatch(fail(ERROR, err));
// 	}
// };

// export const updateUserRequest = (id, values, token) => async () => {
// 	const response = await fetch(`${API_URL}/requests/users/${id}`, {
// 		method: 'PUT',
// 		headers: {
// 			Authorization: 'Bearer ' + token,
// 			'Content-Type': 'application/json'
// 		},
// 		credentials: 'same-origin',
// 		body: JSON.stringify(values)
// 	});
// 	console.log(await response.json());
// };

// ****************REQUESTS**********************************
export const publicationCreationRequest = values => async () => {
	const response = await fetch(`${API_URL}/requests/publications/isbn-ismn`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(values)
	});
	await response.json();
};

export const fetchPublicationIsbnIsmnRequestsList = (searchText, token, sortStateBy, offset) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/requests/publications/isbn-ismn/query`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				queries: [{
					query: {state: sortStateBy, title: searchText}
				}],
				offset: offset
			})
		});
		const result = await response.json();
		dispatch(success(PUBLICATIONISBNISMN_REQUESTS_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchPublicationIsbnIsmnRequest = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch(`${API_URL}/requests/publications/isbn-ismn/${id}`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();
		dispatch(success(PUBLICATION_ISBN_ISMN_REQUEST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const updatePublicationIsbnIsmnRequest = (id, values, token) => async dispatch => {
	dispatch(setLoader());
	try {
		delete values.backgroundProcessingState;
		const response = await fetch(`${API_URL}/requests/publications/isbn-ismn/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			body: JSON.stringify(values)
		});
		const result = await response.json();
		dispatch(success(PUBLICATIONISBNISMN_REQUESTS_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const issnCreationRequest = values => async dispatch => {
	const response = await fetch(`${API_URL}/requests/publications/issn`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(values)
	});
	if (response.status === 200) {
		dispatch(setMessage({color: 'success', msg: 'ISSN creation request sent successfully'}));
	}

	return response.status;
};
