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

import React, {useEffect} from 'react';
import {Snackbar, SnackbarContent, IconButton} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import useStyles from '../styles/dialogs';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon
};

export default function (props) {
	const {message, other, openSnackBar, variant, setMessage} = props;
	const classes = useStyles();
	const [open, setOpen] = React.useState(openSnackBar);
	const Icon = variantIcon[variant];

	useEffect(() => {
		setOpen(true);
	}, [message]);

	function handleClose() {
		setOpen(false);
		setMessage(null);
	}

	const component = (
		<Snackbar
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center'
			}}
			open={open}
			autoHideDuration={6000}
			onClose={handleClose}
		>

			<SnackbarContent
				aria-describedby="client-snackbar"
				message={
					<span className={classes.iconText}>
						<Icon className={`${classes.icon} ${classes.iconVariant}`}/>
						{message}
					</span>
				}
				className={`${classes[variant]}`}
				action={[
					<IconButton key="close" aria-label="Close" color="inherit" onClick={handleClose}>
						<CloseIcon/>
					</IconButton>
				]}
				{...other}/>
		</Snackbar>
	);
	return {
		...component
	};
}
