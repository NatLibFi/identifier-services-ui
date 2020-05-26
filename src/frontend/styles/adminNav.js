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
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
	publicMenu: {
		display: 'flex',
		alignItems: 'center',
		minWidth: 200
	},
	adminMenu: {
		display: 'flex',
		maxWidth: '1200px',
		justifyContent: 'start',
		margin: '0 auto'
	},
	active: {
		'& span': {
			fontWeight: 'bold'
		}
	},
	menuExpansionItem: {
		padding: '0 !important',
		margin: '0 !important'
	},
	expansionPanel: {
		margin: '0 !important'
	},
	expansionPanelSummary: {
		padding: '0px 10px !important',
		background: '#fff'
	},
	appBar: {
		height: 50,
		justifyContent: 'center',
		boxShadow: 'none',
		borderBottom: '1px solid rgba(0, 34, 79, 0.04)',
		background: 'whitesmoke'
	},
	menuItem: {
		fontSize: '1rem',
		height: 50,
		display: 'flex',
		alignItems: 'center',
		'& :hover': {
			fontWeight: 'bold'
		}
	},
	menuIcon: {
		height: 50,
		display: 'flex',
		alignItems: 'center',
		paddingRight: 20
	},
	menuContainer: {
		padding: '10px !important',
		'& :hover': {
			fontWeight: 'bold'
		}
	}
});

export default useStyles;
