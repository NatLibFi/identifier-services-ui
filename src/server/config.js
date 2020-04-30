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

import {Utils} from '@natlibfi/identifier-services-commons';

const {readEnvironmentVariable} = Utils;

export const HTTP_PORT = readEnvironmentVariable('HTTP_PORT', {
	defaultValue: 8080,
	format: v => Number(v)
});

export const SMTP_URL = readEnvironmentVariable('SMTP_URL');

export const API_URL = readEnvironmentVariable('API_URL', {
	defaultValue: 'http://localhost:8081'
});

export const QUERY_LIMIT = readEnvironmentVariable('QUERY_LIMIT', {
	defaultValue: 5
});
export const TOKEN_MAX_AGE = readEnvironmentVariable('TOKEN_MAX_AGE', {
	defaultValue: 30000000
});

export const REDUX_EXTENSION = readEnvironmentVariable('REDUX_EXTENSION', {
	defaultValue: 'development'
});

export const SSO_URL = readEnvironmentVariable('SSO_URL');
export const NOTIFICATION_URL = readEnvironmentVariable('NOTIFICATION_URL');
export const PRIVATE_KEY_URL = readEnvironmentVariable('PRIVATE_KEY_URL');
export const PASSPORT_LOCAL = readEnvironmentVariable('PASSPORT_LOCAL');
export const SYSTEM_USERNAME = readEnvironmentVariable('SYSTEM_USERNAME');
export const SYSTEM_PASSWORD = readEnvironmentVariable('SYSTEM_PASSWORD');
export const COOKIE_NAME = readEnvironmentVariable('COOKIE_NAME');
