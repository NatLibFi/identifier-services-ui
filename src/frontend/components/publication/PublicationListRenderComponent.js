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

import {commonStyles} from '../../styles/app';
import useModalStyles from '../../styles/formList';
import Spinner from '../Spinner';
import TableComponent from '../TableComponent';
import IsbnIsmn from './isbnIsmn/IsbnIsmn';
import Issn from './issn/Issn';
import ModalLayout from '../ModalLayout';
import IsbnIsmnRegForm from '../form/IsbnIsmnRegForm';
import IssnRegForm from '../form/IssnRegForm';

export default function (props) {
	const classes = commonStyles();
	const modalClasses = useModalStyles();

	const {
		loading,
		publicationList,
		totalpublication,
		offset,
		queryDocCount,
		headRows,
		cursors,
		setLastCursor,
		isbnIsmn,
		issn,
		handleTableRowClick,
		rowSelectedId,
		setIsCreating,
		role
	} = props;

	const [page, setPage] = useState(1);

	let usersData;
	if (loading) {
		usersData = <Spinner/>;
	} else if (publicationList === undefined || publicationList === null || publicationList.length === 0) {
		usersData = <p>No Publication Available</p>;
	} else {
		usersData = (
			<TableComponent
				data={publicationList.map(item => usersDataRender(item))}
				handleTableRowClick={handleTableRowClick}
				rowSelectedId={rowSelectedId}
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
			<Grid item xs={12} className={classes.listSearch}>
				<Typography variant="h5">List of Avaiable Publications</Typography>
				{(role === 'publisher' || role === 'publisher-admin') && (
					isbnIsmn ?
						(
							<ModalLayout form label="ISBN-ISMN Publication Form" title="Create ISBN-ISMN" name="newIsbnIsmn" variant="outlined" classed={modalClasses.button} color="primary">
								<IsbnIsmnRegForm setIsCreating={setIsCreating} {...props}/>
							</ModalLayout>
						) : (
							issn ?
								(
									<ModalLayout form label="ISSN Publication Form" title="Create ISSN" name="newIssn" variant="outlined" classed={modalClasses.button} color="primary">
										<IssnRegForm setIsCreating={setIsCreating} {...props}/>
									</ModalLayout>
								) : null
						)
				)}
				{usersData}
				{issn ?	<Issn {...props}/> : (
					isbnIsmn ?	<IsbnIsmn {...props}/> : null
				)}
			</Grid>
		</Grid>
	);
	return {
		...component
	};
}
