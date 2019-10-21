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

	container: {
		display: 'grid',
		alignItems: 'center'
	},
	modaltitle: {
		borderBottom: '1px solid #c0c0c091',
		background: 'whitesmoke',
		color: '#00224f',
		padding: '10px 20px'
	},
	main: {
		minHeight: 90,
		maxHeight: 900,
		overflowY: 'auto',
		position: 'relative',
		margin: '0px auto',
		borderRadius: 5,
		backgroundColor: '#fff',
		outline: 'none'
	},
	closeButton: {
		'& span': {
			width: '30px',
			height: '30px',
			fontSize: '1rem',
			borderRadius: '50%'
		},
		color: '#00224f',
		position: 'absolute',
		cursor: 'pointer',
		right: 0,
		top: 0
	},
	userContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	welcomeAvatar: {
		display: 'inherit',
		alignItems: 'center',
		justifyItems: 'flex-end'
	}
});

export default useStyles;
