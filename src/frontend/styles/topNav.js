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
	topBarContainer: {
		backgroundColor: '#00224f'
	},
	topBar: {
		maxWidth: '1200px',
		margin: '0 auto',
		'&  header': {
			boxShadow: 'none'
		}
	},
	navbarContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	mainLogo: {
		height: '75px',
		width: '75px',
		paddingTop: '8px'
	},
	rightMenu: {
		display: 'grid',
		gridTemplateColumns: '4fr 1fr 1fr',
		alignItems: 'center',
		color: 'white',
		'& svg': {
			justifySelf: 'right'
		}
	},
	rightMenuLogIn: {
		display: 'flex',
		alignItems: 'center',
		color: 'white'
	},
	languageSelect: {
		display: 'inherit',
		gridTemplateColumns: '1fr 1fr',
		cursor: 'pointer',
		'& span': {
			fontSize: '1rem',
			paddingLeft: '5px'
		}
	},
	loginButton: {
		marginRight: 10,
		padding: '0 10px',
		background: '#00224f',
		color: 'white'
	},
	icon: {
		height: 30,
		width: 30,
		cursor: 'pointer'
	}
});

export default useStyles;
