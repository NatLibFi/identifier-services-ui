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
import {NavLink as Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';
import {AppBar, Grid} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import useStyles from '../../styles/adminNav';
import MenuTabs from './menuTabs';

export default function ({userInfo, isAuthenticated}) {
	const classes = useStyles();

	const obj = [
		{
			label: <FormattedMessage id="app.menu.publishers"/>,
			roleView: ['admin', 'publisher'],
			path: 'publishers'
		},
		{
			label: <FormattedMessage id="app.menu.publications"/>,
			roleView: ['admin', 'publisher-admin', 'publisher'],
			listItem: [
				{label: <FormattedMessage id="app.subMenu.ISBN-ISMN"/>, path: 'publications/isbn-ismn', roleView: ['admin', 'publisher-admin', 'publisher']},
				{label: <FormattedMessage id="app.subMenu.ISSN"/>, path: 'publications/issn', roleView: ['admin', 'publisher-admin', 'publisher']}
			]
		},
		{
			label: <FormattedMessage id="app.menu.requests"/>,
			roleView: ['admin', 'system', 'publisher-admin', 'publisher'],
			listItem: [
				{label: <FormattedMessage id="app.subMenu.publishers"/>, path: 'requests/publishers', roleView: ['admin', 'system']},
				{label: <FormattedMessage id="app.subMenu.publications"/>, roleView: ['admin', 'system', 'publisher-admin', 'publisher'], listItem: [
					{label: <FormattedMessage id="app.subSubMenu.ISBN-ISMN"/>, path: 'requests/publications/isbn-ismn', roleView: ['admin', 'system', 'publisher-admin', 'publisher']},
					{label: <FormattedMessage id="app.subSubMenu.ISSN"/>, path: 'requests/publications/issn', roleView: ['admin', 'system']}
				]},
				{label: <FormattedMessage id="app.subMenu.users"/>, path: 'requests/users', roleView: ['admin', 'system', 'publisher-admin']}
			]
		},
		{
			label: <FormattedMessage id="app.menu.users"/>,
			roleView: ['admin', 'publisher-admin', 'publisher'],
			path: 'users'
		},
		{
			label: <FormattedMessage id="app.menu.identifierRanges"/>,
			roleView: ['admin'],
			// Path: 'ranges'
			listItem: [
				{label: <FormattedMessage id="app.subMenu.IRISBNISMN"/>, path: 'ranges', roleView: ['admin']},
				{label: <FormattedMessage id="app.subMenu.IRISSN"/>, path: 'ranges/issn', roleView: ['admin']}
			]
		},
		// {
		// 	label: <FormattedMessage id="app.menu.identifierRanges"/>,
		// 	roleView: ['admin'],
		// 	listItem: [
		// 		{label: <FormattedMessage id="app.subMenu.IRISBN"/>, path: 'ranges/isbn', roleView: ['admin']},
		// 		{label: <FormattedMessage id="app.subMenu.IRISMN"/>, path: 'ranges/ismn', roleView: ['admin']},
		// 		{label: <FormattedMessage id="app.subMenu.IRISSN"/>, path: 'ranges/issn', roleView: ['admin']}
		// 	]
		// },
		{
			label: <FormattedMessage id="app.menu.messageTemplates"/>,
			path: 'templates',
			roleView: ['admin']
		}
	];
	const nav = (
		<Grid container>
			<Grid item xs={12}>
				<AppBar position="static" color="secondary" className={classes.appBar}>
					<div>
						<div className={classes.adminMenu}>
							{isAuthenticated ? renderMenuTabs() : (
								<div className={classes.publicMenu}>
									<Link exact to="/" activeClassName={classes.active}><div className={classes.menuIcon}><HomeIcon fontSize="default" color="primary"/></div></Link>
									<Link exact to="/publishers" activeClassName={classes.active}><div className={classes.menuItem}><FormattedMessage id="app.publicMenu.publishers"/></div></Link>
								</div>
							)}
						</div>
					</div>
				</AppBar>
			</Grid>
		</Grid>
	);

	function renderMenuTabs() {
		const profileTab = userInfo.role === 'publisher-admin' ?
			(
				<>
					<Link exact to={`/publishers/${userInfo.publisher}`} activeClassName={classes.active}>
						<div className={classes.menuIcon}><AccountBoxIcon fontSize="default" color="primary"/></div>
					</Link>
					{obj.map(list => list.roleView.includes(userInfo.role) && (
						<MenuTabs role={userInfo.role} list={list}/>
					))}
				</>
			) : obj.map(list => list.roleView.includes(userInfo.role) && (
				<MenuTabs key={list.label} role={userInfo.role} list={list}/>
			));

		return profileTab;
	}

	return {
		...nav
	};
}

