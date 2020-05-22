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
import {List, ListItem, Typography, Button} from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import notes from './notes';
import useStyles from '../../../styles/form';

export default function (props) {
	const classes = useStyles();
	const {setInformation} = props;

	const component = (
		<>
			{renderNotes()}
		</>
	);

	return {
		...component
	};
	function renderNotes() {
		return (
			<div className={classes.notesContainer}>
				<Typography className={classes.notes}>When joining the ISBN system, the publisher commits itself to the following obligations:</Typography>
				<List>
					{notes.map(item => (
						<ListItem key={item} className={classes.notesList}>
							<ArrowRightAltIcon/>
							<Typography className={classes.notes}>{item}</Typography>
						</ListItem>
					))}
					<Button variant="contained" onClick={() => setInformation(false)}> Next </Button>
				</List>
			</div>
		);
	}
}
