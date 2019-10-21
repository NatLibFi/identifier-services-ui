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
import {Grid, Typography, Button} from '@material-ui/core';
import RightIcon from '@material-ui/icons/ChevronRight';
import useStyles from '../../../styles/issn';
import {FormattedMessage} from 'react-intl';

export default function () {
	const classes = useStyles();
	return (
		<div className={classes.IssnContainer}>
			<Grid container>
				<Grid item xs={12}>
					<Typography variant="h4">ISSN</Typography>
					<hr/>
					<Typography paragraph>
						<FormattedMessage id="app.home.ISSN" values={{lineBreak: <br/>}}/>
					</Typography>
					<Button
						color="primary"
						href="https://www.kansalliskirjasto.fi/en/services/expert-services-of-data-description/issn"
						target="_blank"
					>
						<FormattedMessage id="app.home.more-button"/>
						<RightIcon/>
					</Button>
				</Grid>
			</Grid>
		</div>
	);
}
