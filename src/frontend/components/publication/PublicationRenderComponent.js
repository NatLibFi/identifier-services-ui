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
	Grid,
	List,
	ListItem,
	ListItemText
} from '@material-ui/core';
import {Field} from 'redux-form';

import useFormStyles from '../../styles/form';
import ListComponent from '../ListComponent';
import renderTextField from '../form/render/renderTextField';
import Spinner from '../Spinner';

export default function (props) {
	const {publication, loading, isEdit} = props;
	const formClasses = useFormStyles();

	let publicationDetail;
	if (publication === undefined || loading) {
		publicationDetail = <Spinner/>;
	} else {
		publicationDetail = (
			<>
				{isEdit ?
					<>
						<Grid item xs={12} md={6}>
							<List>
								<ListItem>
									<ListItemText>
										<Grid container>
											<Grid item xs={4}>Name:</Grid>
											<Grid item xs={8}><Field name="name" className={formClasses.editForm} component={renderTextField}/></Grid>
										</Grid>
									</ListItemText>
								</ListItem>
							</List>
						</Grid>
					</> :
					<>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(publication).map(key => {
										return (typeof publication[key] === 'string' || typeof publication[key] === 'boolean') ?
											(
												<ListComponent label={key} value={publication[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(publication).map(key => {
										return typeof publication[key] === 'object' ?
											(
												<ListComponent label={key} value={publication[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
					</>}
			</>
		);
	}

	return publicationDetail;
}
