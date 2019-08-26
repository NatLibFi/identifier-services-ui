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

// import axios from 'axios';
import {CONTACT, FETCH_MESSAGE, FETCH_MESSAGES_LIST, ERROR} from './types';
import fetch from 'node-fetch';
import {setLoader, success, fail} from './commonAction';

export const sendMessage = values => async dispatch => {
	dispatch(setLoader());
	const response = await fetch('/message', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(values)
	});
	if (response.status === 200) {
		dispatch({
			type: CONTACT,
			payload: 'Message Sent'
		});
	}
};

export const createMessageTemplate = values => async dispatch => {
	dispatch(setLoader());
	/* global API_URL */
	/* eslint no-undef: "error" */
	const response = await fetch(`${API_URL}/templates`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(values)
	});
	await response.json();
};

export const fetchMessagesList = (token, offset) => async dispatch => {
	dispatch(setLoader());
	try {
		/* global API_URL */
		/* eslint no-undef: "error" */
		const response = await fetch(`${API_URL}/templates/query`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({queries: [{
				query: {}
			}],
			offset: offset})
		});
		const result = await response.json();
		dispatch(success(FETCH_MESSAGES_LIST, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const fetchMessage = (id, token) => async dispatch => {
	dispatch(setLoader());
	try {
		/* global API_URL */
		/* eslint no-undef: "error" */
		const response = await fetch(`${API_URL}/templates/${id}`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const result = await response.json();
		dispatch(success(FETCH_MESSAGE, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};
