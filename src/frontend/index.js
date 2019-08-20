/* eslint-disable no-undef */
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
import App from './App';
import {Provider} from 'react-redux';
import allReducers from './store/reducers';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {addLocaleData} from 'react-intl';
import {setLocale} from './store/actions/localeAction';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';
import sv from 'react-intl/locale-data/sv';
import {CookiesProvider} from 'react-cookie';
import {getUserInfo} from './store/actions/auth';

addLocaleData([...en, ...fi, ...sv]);

const composeEnhancers =
process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :
	compose;

const store = createStore(allReducers, composeEnhancers(applyMiddleware(thunk)));

if (localStorage.allLang) {
	store.dispatch(setLocale(localStorage.allLang));
}

function readCookie(name) {
	var nameEQ = name + '=';
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

const cookie = readCookie('login-cookie');
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
