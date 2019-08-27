
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
		maxWidth: 900,
		margin: '40px 0px 40px 0px',
		flexGrow: 1
	},
	subContainer: {
		flexGrow: 1,
		padding: '0 10px'
	},
	btnContainer: {
		marginTop: 35,
		'& button': {
			margin: '0 5px'
		}
	},
	textField: {
		height: '60px',
		width: '100%'
	},
	selectField: {
		width: '100%'
	},
	arrayString: {
		height: '60px',
		width: '95%'
	},
	full: {
		flexDirection: 'column'
	},
	half: {
		flexDirection: 'row'
	},
	textArea: {
		height: '180px',
		width: '100%'
	},
	stepLabel: {
		textTransform: 'capitalize'
	},
	editForm: {
		display: 'flex'
	},
	editFormAliases: {
		display: 'flex',
		width: '90%'
	},
	children: {
		margin: '0 20px 0 0',
		width: '80%'
	},
	authors: {
		display: 'flex',
		flexDirection: 'column',
		'& button': {
			marginTop: 15
		}
	},
	authorDetails: {
		margin: '15px 0'
	},
	toggleBtnGrp: {
		margin: '20px 0',
		'& button': {
			height: 'fit-content'
		}
	}
});

export default useStyles;
