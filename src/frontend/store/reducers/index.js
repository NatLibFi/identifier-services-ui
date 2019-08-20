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
import {combineReducers} from 'redux';
import {reducer as forms} from 'redux-form';
import publisherReducer from './publisher';
import authReducer from './authReducer';
import localeReducer from './localeReducer';
import contact from './messageReducer';
import common from './commonReducer';
import userReducer from './userReducer';

export default combineReducers({
	locale: localeReducer,
	form: forms,
	publisher: publisherReducer,
	login: authReducer,
	contact: contact,
	common: common,
	users: userReducer
});
