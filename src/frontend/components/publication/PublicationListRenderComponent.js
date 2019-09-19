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

import React, {useState} from 'react';
import {Grid, Typography} from '@material-ui/core';

import useStyles from '../../styles/publisherLists';
import Spinner from '../Spinner';
import TableComponent from '../TableComponent';

export default function (props) {
	const classes = useStyles();
	const {
		loading,
		publicationList,
		totalpublication,
		offset,
		queryDocCount,
		headRows,
		cursors,
		setLastCursor,
		handleTableRowClick
	} = props;

	const [page, setPage] = useState(1);

	let usersData;
	if (loading) {
		usersData = <Spinner/>;
	} else if (publicationList === undefined || publicationList === null) {
		usersData = <p>No Publication Available</p>;
	} else {
		usersData = (
			<TableComponent
				data={publicationList.map(item => usersDataRender(item))}
				handleTableRowClick={handleTableRowClick}
				headRows={headRows}
				offset={offset}
				page={page}
				setPage={setPage}
				cursors={cursors}
				setLastCursor={setLastCursor}
				totalDoc={totalpublication}
				queryDocCount={queryDocCount}
			/>
		);
	}

	function usersDataRender(item) {
		const {id} = item;
		const keys = headRows.map(k => k.id);
		const result = keys.reduce((acc, key) => {
			return {...acc, [key]: item[key]};
		}, {});
		return {
			id: id,
			...result
		};
	}

	const component = (
		<Grid>
			<Grid item xs={12} className={classes.publisherListSearch}>
				<Typography variant="h5">List of Avaiable Publication</Typography>
				{usersData}
			</Grid>
		</Grid>
	);
	return {
		...component
	};
}
