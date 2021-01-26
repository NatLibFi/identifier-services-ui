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
		MuiButton: {
			outlinedPrimary: {
				'&:hover': {
					backgroundColor: '#00224f',
					color: '#fff'
				}
			}
		},
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
				paddingRight: 0,
				background: 'white'
			},
			root: {
				paddingTop: 5,
				paddingBottom: 5
			}
		},
		MuiListItemText: {
			root: {
				margin: '5px 0',
				background: '#edf7fb'
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
		MuiExpansionPanel: {
			root: {
				borderLeft: '2px solid #00224f42',
				borderRadius: 0
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
		},
		MuiFab: {
			sizeSmall: {
				width: '35px',
				height: '20px'
			}
		},
		MuiTableCell: {
			root: {
				fontSize: '0.7rem',
				padding: '16px 0'
			},
			body: {
				width: 200
			},
			head: {
				width: 200
			},
			footer: {
				width: '10%'
			}
		},
		MuiIconButton: {
			root: {
				padding: 0
			}
		},
		MuiInputBase: {
			root: {
				display: 'flex'
			}
		}
	}
});

export const commonStyles = makeStyles({
	'@global': {
		body: {
			overflow: 'auto !important',
			paddingRight: '0 !important',
			background: '#ffffff',
			'& ::-webkit-scrollbar': {
				width: '1em'
			}
		},
		a: {
			textDecoration: 'none',
			color: '#00224f'
		}
	},

	bodyContainer: {
		marginBottom: 40
	},
	listSearch: {
		margin: '0 auto',
		padding: '60px',
		'& h5': {
			marginBottom: 8
		}
	},
	listComponent: {
		minHeight: '300px',
		margin: '0 auto',
		'& h5': {
			marginBottom: 8
		}
	},
	listItemSpinner: {
		justifyContent: 'left',
		marginBottom: 10
	},
	listItem: {
		minWidth: '750px',
		padding: '60px',
		height: 'auto'
	},
	btnContainer: {
		display: 'flex',
		flexGrow: 1,
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
	},
	radioLabel: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	fab: {
		marginLeft: '10px'
	},
	main: {
		width: 1200,
		minHeight: 90,
		maxHeight: 900,
		position: 'relative',
		margin: '0px auto',
		borderRadius: 5,
		backgroundColor: '#fff',
		outline: 'none'
	},
	formControl: {
		margin: theme.spacing(1),
		width: '100%'
	}

});

export default theme;
