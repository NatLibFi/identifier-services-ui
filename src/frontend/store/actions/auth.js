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
import {AUTHENTICATION, LOG_OUT} from './types';
import fetch from 'node-fetch';

export const normalLogin = values => async dispatch => {
	const response = await fetch('/auth', {
		method: 'POST',
		body: JSON.stringify(values),
		headers: {'Content-Type': 'application/json'}
	});
	const result = await response.json();

	dispatch(getUserInfo(result));
	return response.status;
};

export const getUserInfo = token => async dispatch => {
	// eslint-disable-next-line no-undef
	const result = await fetch(`${API_URL}/auth`, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token
		}
	});
	const user = await result.json();
	const updatedUser = {...user, role: user.groups};
	delete updatedUser.groups;
	dispatch({
		type: AUTHENTICATION,
		payload: updatedUser
	});
};

export const logOut = () => async dispatch => {
	await fetch('/logout', {
		method: 'GET'
	});
	dispatch({
		type: LOG_OUT,
		payload: false
	});
};
