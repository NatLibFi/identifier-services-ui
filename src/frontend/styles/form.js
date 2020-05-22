
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

const useStyles = makeStyles(theme => ({
	container: {
		width: 900,
		margin: '40px 0px 40px 0px',
		flexGrow: 1
	},
	passwordResetContainer: {
		width: '30%',
		margin: '0 auto',
		display: 'flex',
		height: 'calc(100vh - 300px)',
		alignItems: 'center'
	},
	subContainer: {
		flexGrow: 1,
		padding: '0 20px'
	},
	bodyContainer: {
		maxHeight: '500px',
		overflowY: 'auto'
	},
	captchaContainer: {
		display: 'flex',
		alignItems: 'center',
		'& button': {
			fontWeight: 600,
			color: theme.palette.primary.main,
			textTransform: 'Capitalize'
		}
	},
	btnContainer: {
		marginTop: 35,
		'& button': {
			margin: '0 5px'
		}
	},
	textField: {
		height: '40px',
		width: '100%'
	},
	arrayString: {
		width: '95%'
	},
	selectField: {
		height: '40px',
		width: '100%'
	},
	full: {
		flexDirection: 'column'
	},
	half: {
		flexDirection: 'row'
	},
	textArea: {
		width: '100%'
	},
	stepLabel: {
		textTransform: 'capitalize'
	},
	smallFontStepLabel: {
		textTransform: 'capitalize',
		'& span': {
			fontSize: '0.65rem'
		}
	},
	editForm: {
		width: '100%'
	},
	editFormAliases: {
		display: 'flex',
		width: '90%'
	},
	children: {
		margin: '0 20px 0 0',
		width: '80%'
	},
	fullWidth: {
		width: '100%'
	},
	formHead: {
		width: '100%',
		marginTop: '25px',
		marginLeft: '5px',
		fontSize: '1rem',
		fontWeight: 600,
		textTransform: 'uppercase'
	},
	affiliatesAddBtn: {
		display: 'flex',
		alignItems: 'center'
	},
	captcha: {
		marginTop: '10px',
		width: '40%'
	},
	resetFormCaptcha: {
		width: '100%'
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
	},
	radioDirectionRow: {
		flexDirection: 'row !important',
		flexWrap: 'nowrap !important'
	},
	smallStepper: {
		width: '60%',
		margin: '0 auto',
		padding: '0 0 10px 0'
	},
	addFabBtn: {
		marginTop: '15px'
	},
	dateTimePicker: {
		width: '100%',
		marginTop: '0 !important'
	},
	paperRoot: {
		padding: theme.spacing(1, 1),
		display: 'flex',
		justifyContent: 'space-between'
	},
	deleteIcon: {
		margin: theme.spacing(0.5)
	},
	pubFormSelect: {
		width: 600,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		'& button': {
			height: 60,
			width: 200,
			margin: '20px 0px'
		}
	},

	resetForm: {
		border: '1px solid #d4cacad1',
		padding: 20,
		borderRadius: 5
	},
	usercreationSelect: {
		display: 'flex',
		justifyContent: 'center'
	},
	addBtn: {
		padding: 8
	},
	popOver: {
		display: 'flex',
		alignItems: 'center'
	},
	notesContainer: {
		maxWidth: '900px',
		background: '#f1eded',
		padding: '20px',
		'& button': {
			margin: '20px 0'
		}
	},
	notesList: {
		borderBottom: 'none !important',
		padding: 0
	},
	notes: {
		fontSize: '14px'
	},
	typeSelect: {
		width: 900,
		height: 'auto',
		display: 'flex',
		flexDirection: 'column',
		padding: 20,
		margin: '20px 0',
		'& .select-useType': {
			display: 'flex',
			flexDirection: 'column'
		},
		'& h6': {
			fontSize: 15
		},
		'& .note-txt': {
			margin: '30px 0'
		},
		'& .continue-button': {
			marginTop: 50,
			width: 100
		}
	},
	pubSelect: {
		width: 500
	}
}));

export default useStyles;
