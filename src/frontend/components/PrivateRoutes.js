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
import {Route} from 'react-router-dom';
import {Typography} from '@material-ui/core';

import {connect} from 'react-redux';
import DeniedComponent from './DeniedComponent';

export default connect(mapStateToProps)(({isAuthenticated, userInfo, role, component: Component, ...rest}) => {
	const component = (
		<Route
			{...rest}
			render={props => isAuthenticated === true ? (
				role.includes(userInfo.role) ?
					<Component {...props}/> : <DeniedComponent/>
			) : <Typography variant="h4" style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>Please Login to Continue</Typography>}/>
	);
	return {
		...component
	};
});

function mapStateToProps(state) {
	return {
		isAuthenticated: state.login.isAuthenticated,
		userInfo: state.login.userInfo
	};
}
