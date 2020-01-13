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

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import fetch from 'node-fetch';
import thunk from 'redux-thunk';
import App from './App';
import allReducers from './store/reducers';
import {createStore, applyMiddleware} from 'redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {setLocale} from './store/actions/localeAction';
import {CookiesProvider} from 'react-cookie';
import {getUserInfo} from './store/actions/auth';
import {composeWithDevTools} from 'redux-devtools-extension';

run();
async function run() {
	await getConf();
	/* global REDUX_EXTENSION */
	/* eslint no-undef: "error" */
	const store = createStore(allReducers, REDUX_EXTENSION === 'development' ? composeWithDevTools(applyMiddleware(thunk)) : applyMiddleware(thunk));
	/* global localStorage */
	/* eslint no-undef: "error" */
	if (localStorage.allLang) {
		store.dispatch(setLocale(localStorage.allLang));
	}

	function readCookie(name) {
		var nameEQ = name + '=';
		/* global document */
		/* eslint no-undef: "error" */
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1, c.length);
			}

			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}

		return null;
	}

	async function getConf() {
		const temp = await fetch('/conf', {
			method: 'GET'
		});
		const result = await temp.json();
		Object.keys(result).forEach(key => {
			/* global window */
			/* eslint no-undef: "error" */
			window[key] = result[key];
		});
	}

	/* global COOKIE_NAME */
	const cookie = readCookie(COOKIE_NAME);
	if (cookie) {
		store.dispatch(getUserInfo(cookie));
	}

	ReactDOM.render(
		<Provider store={store}>
			<CookiesProvider>
				<Router>
					<App/>
				</Router>
			</CookiesProvider>
		</Provider>, document.getElementById('app'));
}
