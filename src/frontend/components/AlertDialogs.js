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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef((props, ref) => {
	return <Slide ref={ref} direction="up" {...props}/>;
});

export default function (props) {
	const {openAlert, message, setMessage, setOpenAlert} = props;
	const [open, setOpen] = React.useState(openAlert);

	useEffect(() => {
		setOpen(true);
	}, [message, openAlert]);

	function handleClose() {
		setOpen(false);
		setMessage(null);
	}

	function handleAgree() {
		handleClose();
		setOpenAlert(true);
	}

	const component = (
		<div>
			<Dialog
				keepMounted
				open={open}
				TransitionComponent={Transition}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">{message}</DialogTitle>
				<DialogActions>
					<Button color="primary" onClick={handleClose}>
                        Disagree
					</Button>
					<Button color="primary" onClick={handleAgree}>
                        Agree
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);

	return {
		...component
	};
}
