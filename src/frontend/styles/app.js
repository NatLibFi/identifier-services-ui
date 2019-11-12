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
import {createMuiTheme} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#00224f'
		},
		secondary: {
			main: '#ffffff'
		},
		red: {
			backgroundColor: '#ff1744',
			color: '#fff'
		}
	},
	typography: {
		fontFamily: 'Open Sans, Helvetica, Arial'
	},
	overrides: {
		MuiChip: {
			root: {
				margin: '3px',
				background: '#00224fcc !important',
				color: '#fff !important'
			}
		},
		MuiList: {
			root: {
				minWidth: 200,
				'& li:not(:last-child)': {
					borderBottom: '1px solid #f5f5f5'
				}
			},
			padding: {
				paddingTop: 0,
				paddingBottom: 0
			}
		},
		MuiListItem: {
			gutters: {
				paddingLeft: 0,
				paddingRight: 0
			},
			root: {
				paddingTop: 5,
				paddingBottom: 5
			}
		},
		MuiMenu: {
			paper: {
				boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
			}
		},
		MuiPaper: {
			elevation1: {
				boxShadow: 'none'
			}
		},
		MuiExpansionPanelSummary: {
			root: {
				background: '#fafafa'
			}
		},
		MuiExpansionPanelDetails: {
			root: {
				padding: '0 24px 0'
			}
		},
		MuiToolbar: {
			gutters: {
				paddingLeft: 0,
				paddingRight: 0
			}
		},
		MuiToggleButton: {
			root: {
				'&$selected': {
					'& span': {
						color: '#ffffff !important'
					},
					backgroundColor: '#00224f !important'
				}
			}
		}
	}
});

export const commonStyles = makeStyles({

	'@global': {
		body: {
			overflow: 'auto !important',
			paddingRight: '0 !important',
			background: '#ffffff'
		},
		a: {
			textDecoration: 'none',
			color: '#00224f'
		}
	},

	bodyContainer: {
		minHeight: 'calc(100vh - 300px)'
	},
	listSearch: {
		maxWidth: '1200px',
		margin: '0 auto',
		paddingTop: '60px'
	},
	listItemSpinner: {
		justifyContent: 'center'
	},
	listItem: {
		width: 900,
		minWidth: '750px',
		padding: '20px'
	},
	btnContainer: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	usersBtnContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	editForm: {
		width: '100%'
	},
	textArea: {
		width: '50%',
		background: '#ecefec75',
		borderRadius: '5px'
	},
	deniedContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: 40
	},
	loginError: {
		background: '#ffdce0',
		padding: '0 10px',
		color: '#a23737',
		marginBottom: 15,
		border: '1px solid #a04242',
		borderRadius: 5,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%'
	}

});

export default theme;
