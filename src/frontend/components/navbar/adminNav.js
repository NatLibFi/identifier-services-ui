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
import {AppBar, Button, Grid} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import useStyles from '../../styles/adminNav';
import MenuTabs from './menuTabs';

export default function ({userInfo, isAuthenticated}) {
	const classes = useStyles();

	const obj = [
		{
			label: 'Publishers',
			roleView: ['admin', 'publisher'],
			path: 'publishers'
		},
		{
			label: 'Publications',
			roleView: ['admin', 'publisher', 'publisher-admin'],
			listItem: [
				{label: 'ISBN', path: 'publications/isbn-ismn', roleView: ['admin', 'publisher', 'publisher-admin']},
				{label: 'ISMN', path: 'publications/isbn-ismn', roleView: ['admin', 'publisher', 'publisher-admin']},
				{label: 'ISSN', path: 'publications/issn', roleView: ['admin', 'publisher', 'publisher-admin']}
			]
		},
		{
			label: 'Requests',
			roleView: ['admin', 'system', 'publisher', 'publisher-admin'],
			listItem: [
				{label: 'Publishers', path: 'requests/publishers', roleView: ['admin', 'system']},
				{label: 'Publications', roleView: ['admin', 'system', 'publisher', 'publisher-admin'], listItem: [
					{label: 'ISBN-SMN', path: 'requests/publications/isbn-ismn', roleView: ['admin', 'system', 'publisher', 'publisher-admin']},
					{label: 'ISSN', path: 'requests/publications/issn', roleView: ['admin', 'system', 'publisher', 'publisher-admin']}
				]},
				{label: 'Users', path: 'requests/users', roleView: ['admin', 'system', 'publisher-admin']}
			]
		},
		{
			label: 'Users',
			roleView: ['admin', 'publisher-admin'],
			path: 'users'
		},
		{
			label: 'Identifier Ranges',
			roleView: ['admin'],
			listItem: [
				{label: 'ISBN', path: 'ranges/isbn', roleView: ['admin']},
				{label: 'ISMN', path: 'ranges/ismn', roleView: ['admin']},
				{label: 'ISSN', path: 'ranges/issn', roleView: ['admin']}
			]
		},
		{
			label: 'Message Templates',
			path: 'templates',
			roleView: ['admin']
		}
	];
	const nav = (
		<Grid container>
			<Grid item xs={12}>
				<AppBar position="static" color="secondary">
					<div>
						<div className={classes.adminMenu}>
							{isAuthenticated ? renderMenuTabs() : (
								<div className={classes.publicMenu}>
									<Link exact to="/" activeClassName={classes.active}><Button><HomeIcon fontSize="default" color="primary"/></Button></Link>
									<Link exact to="/publishers" activeClassName={classes.active}><Button>Publishers</Button></Link>
								</div>
							)
							}
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
						<Button><AccountBoxIcon fontSize="default" color="primary"/></Button>
					</Link>
					{obj.map(list => list.roleView.includes(userInfo.role) && (
						<MenuTabs key={list.label} role={userInfo.role} list={list}/>
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

