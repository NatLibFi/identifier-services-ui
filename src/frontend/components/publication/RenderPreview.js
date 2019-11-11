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
import {
	Typography,
	Grid,
	List,
	ListItem,
	ListItemText
} from '@material-ui/core';

import {commonStyles} from '../../styles/app';
import Spinner from '../Spinner';

export default function (props) {
	const {data} = props;
	const classes = commonStyles();

	let dataDetail;
	let keys = Object.keys(data).map(key => key);
	if (data === undefined) {
		dataDetail = <Spinner/>;
	} else {
		dataDetail = (
			<Grid item xs={12}>
				<Typography variant="h6">
						Publication Details
				</Typography>
				<List>
					<Grid container xs={12}>
						{keys.map(key => {
							return (
								(typeof data[key] === 'object') ?
									(
										<Grid item md={6}>
											<ListItem key={key}>
												<ListItemText>
													{Array.isArray(data[key]) ?
														data[key].map(obj =>
															renderObject(obj)
														) :
														renderObject(data[key])}
												</ListItemText>
											</ListItem>
										</Grid>
									) : (
										<Grid item md={6}>
											<ListItem key={key}>
												<ListItemText>
													<Grid container>
														<Grid item xs={4}>{formatFieldName(key)}: </Grid>
														<Grid item xs={8}>{data[key].toString()}</Grid>
													</Grid>
												</ListItemText>
											</ListItem>
										</Grid>
									)
							);
						})}
					</Grid>
				</List>
			</Grid>
		);
	}

	function renderObject(obj) {
		return (Object.keys(obj).map(subKey => {
			switch (typeof obj[subKey]) {
				case 'object':
					if (Array.isArray(obj[subKey])) {
						return obj[subKey].map(item => renderObject(item));
					}

					return renderObject(obj[subKey]);

				default:
					return (
						<Grid key={subKey} container>
							<Grid item xs={4}>{formatFieldName(subKey)}: </Grid>
							<Grid item xs={8}>{obj[subKey]}</Grid>
						</Grid>
					);
			}
		}
		));
	}

	const component = (
		<div className={classes.listItem}>
			<Grid container spacing={3} className={classes.listItemSpinner}>
				{dataDetail}
			</Grid>
		</div>
	);
	return {
		...component
	};
}

function formatFieldName(string) {
	const res = string.replace(/([A-Z])/g, ' $1').trim();
	const newString = res.charAt(0).toUpperCase() + res.slice(1);
	return newString;
}
