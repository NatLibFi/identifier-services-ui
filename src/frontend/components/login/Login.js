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
import {Typography, Tabs, Tab, Button} from '@material-ui/core';
import PropTypes from 'prop-types';
import LogOutIcon from '@material-ui/icons/ExitToApp';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';

import LoginForm from './LoginForm';
import HakaLogin from './HakaLogin';
import useStyles from '../../styles/login';
import * as actions from '../../store/actions';
import PasswordResetForm from '../form/PasswordResetForm';

export default connect(mapStateToProps, actions)(props => {
	const [value, setValue] = React.useState(0);
	const {forgotPwd, setPwd} = props;
	const classes = useStyles();

	function handleChange(event, newValue) {
		setValue(newValue);
	}

	const handleLogOut = () => {
		props.logOut();
		props.history.push('/');
		props.handleClose();
	};

	const component = (
		<div className={classes.main}>
			{(props.isAuthenticated) ?
				<div
					className={classes.logoutContainer}
					onClick={handleLogOut}
				>
					<Button>
						<LogOutIcon fontSize="large"/>
						<Typography variant="h6">Logout</Typography>
					</Button>
				</div> :
				<>
					{forgotPwd ?
						<PasswordResetForm/> :
						<div>
							<Tabs
								value={value}
								variant="scrollable"
								scrollButtons="off"
								indicatorColor="primary"
								textColor="primary"
								onChange={handleChange}
							>
								<Tab label={<FormattedMessage id="login.normal.login"/>}/>
								<Tab label={<FormattedMessage id="login.haka.login"/>}/>
							</Tabs>
							{value === 0 && <TabContainer><LoginForm setPwd={setPwd} {...props}/></TabContainer>}
							{value === 1 && <TabContainer><HakaLogin/></TabContainer>}
						</div>}
				</>}
		</div>
	);

	return {
		...component
	};
});

function TabContainer(props) {
	const component = (
		<Typography component="div">
			{props.children}
		</Typography>
	);
	return {
		...component,
		children: PropTypes.node.isRequired
	};
}

function mapStateToProps(state) {
	return ({
		user: state
	});
}

