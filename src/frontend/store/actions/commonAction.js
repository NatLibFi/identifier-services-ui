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
import {LOADER, GET_CAPTCHA, ERROR, GET_API_URL} from './types';

export function success(type, payload) {
	return ({
		type: type,
		payload: payload
	});
}

export function fail(type, payload) {
	return ({
		type: type,
		payload: payload
	});
}

export const setLoader = () => {
	return {
		type: LOADER
	};
};

export const loadSvgCaptcha = () => async dispatch => {
	dispatch(setLoader());
	try {
		const response = await fetch('http://localhost:8080/captcha', {
			method: 'GET'
		});
		const result = await response.json();
		dispatch(success(GET_CAPTCHA, result));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const postCaptchaInput = (inputData, id) => async dispatch => {
	const body = {
		captchaInput: inputData,
		id
	};
	dispatch(setLoader());
	try {
		const response = await fetch('http://localhost:8080/captcha', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		const result = await response.json();
		return result;
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

export const getApiUrl = () => async dispatch => {
	try {
		const temp = await fetch('http://localhost:8080/conf', {
			method: 'GET'
		});
		const result = await temp.json();
		dispatch(success(GET_API_URL, result.API_URL));
	} catch (err) {
		dispatch(fail(ERROR, err));
	}
};

