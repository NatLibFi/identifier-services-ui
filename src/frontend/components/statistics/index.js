/* eslint-disable react-hooks/exhaustive-deps */
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

import React, {useState, useEffect} from 'react';
import {
	Grid,
	Typography,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Button,
	MenuItem,
	Radio,
	TextField,
	Select
} from '@material-ui/core';
import {connect} from 'react-redux';
import {useCookies} from 'react-cookie';
import {FormattedMessage} from 'react-intl';
import XLSX from 'xlsx';
import useStyles from '../../styles/statistic';
import * as actions from '../../store/actions';

export default connect(mapStateToProps, actions)(props => {
	const {fetchRangeStatistics, fetchIssnStatistics, rangeStatistics, issnStatistics, exportXLS} = props;
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [publicationType, setPublicationType] = useState(null);
	const [selectedIsbnIsmnType, setSelectedIsbnIsmnType] = useState(null);
	const [selectedIssnType, setSelectedIssnType] = useState(null);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [fetchedRangeStatistics, setFetchedRangeStatistics] = useState(null);

	useEffect(() => {
		if (rangeStatistics !== null) {
			rangeStatistics.reduce((acc, item) => {
				acc.push({prefix: item.prefix});
				return acc;
			}, []);
			setFetchedRangeStatistics(rangeStatistics);
		}
	}, [rangeStatistics]);

	useEffect(() => {
		if (fetchedRangeStatistics !== null) {
			const totalStatistics = fetchedRangeStatistics.map(item => filterDoc(item));
			if (issnStatistics !== null) {
				const wbout = XLSX.utils.book_new();
				const monthlyStatistics = getMonthlyStatistics(issnStatistics);
				const ws = XLSX.utils.json_to_sheet(totalStatistics);
				XLSX.utils.sheet_add_json(ws, monthlyStatistics, {origin: {r: totalStatistics.length + 2, c: 1}});
				exportXLS(wbout, ws);
			}
		}
	}, [exportXLS, fetchedRangeStatistics, getMonthlyStatistics, issnStatistics]);

	const classes = useStyles();

	const publicationTypeOptions = [
		{label: 'Isbn-Ismn', value: 'isbn-ismn'},
		{label: 'Issn', value: 'issn'}
	];

	function handlePublicationTypeChange(event) {
		setPublicationType(event.target.value);
	}

	function handleSelectedIsbnIsmnTypeChange(event) {
		setSelectedIsbnIsmnType(event.target.value);
	}

	function handleSelectedIssnTypeChange(event) {
		setSelectedIssnType(event.target.value);
	}

	function filterDoc(doc) {
		return Object.entries(doc)
			.filter(([key]) => key === '_id' === false)
			.filter(([key]) => key === 'rangeStart' === false)
			.filter(([key]) => key === 'rangeEnd' === false)
			.filter(([key]) => key === 'active' === false)
			.filter(([key]) => key === 'canceled' === false)
			.filter(([key]) => key === 'lastUpdated' === false)
			.filter(([key]) => key === 'isClosed' === false)
			.filter(([key]) => key === 'created' === false)
			.filter(([key]) => key === 'next' === false)
			.reduce((acc, [
				key,
				value
			]) => ({...acc, [key]: value}), {total: `${Number(doc.rangeEnd) - Number(doc.rangeStart)}`});
	}

	function getMonthlyStatistics(value) {
		let yearStart = Number(startDate.slice(0, 4));
		let monthStart = Number(startDate.slice(5, 7));

		let yearEnd = Number(endDate.slice(0, 4));
		let monthEnd = Number(endDate.slice(5, 7));
		let result = [];

		for (yearStart; yearStart <= yearEnd; yearStart++) {
			result.push(yearStart);
		}

		const newResult = result.reduce((acc, item, index) => {
			const length = result.length;
			if (index === 0 && length > 1) {
				for (let month = monthStart; month <= 12; month++) {
					const m = `${month}`.length === 1 ? `${item}-0${month}` : `${item}-${month}`;
					const monthlyIssn = fetchMonthlyIssn(m);
					if (monthlyIssn.length > 0) {
						acc.push(...monthlyIssn);
					}
				}
			} else if (index === result.length - 1) {
				for (let month = 1; month <= monthEnd; month++) {
					const m = `${month}`.length === 1 ? `${item}-0${month}` : `${item}-${month}`;
					const monthlyIssn = fetchMonthlyIssn(m);
					if (monthlyIssn.length > 0) {
						acc.push(...monthlyIssn);
					}
				}
			} else {
				for (let month = 1; month <= 12; month++) {
					const m = `${month}`.length === 1 ? `${item}-0${month}` : `${item}-${month}`;
					const monthlyIssn = fetchMonthlyIssn(m);

					if (monthlyIssn.length > 0) {
						acc.push(...monthlyIssn);
					}
				}
			}

			return acc;
		}, []);

		function fetchMonthlyIssn(month) {
			const res = value.reduce((acc, item) => {
				const timestamp = item.created.timestamp.slice(0, 7);
				if (timestamp === month) {
					item.identifier.forEach(k => {
						if (!acc.includes({month: month})) {
							if (acc.some(item => item.prefix === k.id.slice(0, 4))) {
								acc = acc.map(a => {
									if (a.prefix === k.id.slice(0, 4)) {
										return {...a, frequency: a.frequency + 1};
									}

									return a;
								});
							} else {
								acc.push({month, prefix: k.id.slice(0, 4), frequency: 1});
								return acc;
							}
						}

						return acc;
					});
				}

				return acc;
			}, []);
			return res;
		}

		return newResult;
	}

	function handleStatistics() {
		if (publicationType === 'issn') {
			if (selectedIssnType === 'issn' && startDate !== null && endDate !== null) {
				fetchRangeStatistics({startDate, endDate, token: cookie[COOKIE_NAME]});
				fetchIssnStatistics({startDate, endDate, token: cookie[COOKIE_NAME]});
			}
		}
	}

	const elements = (
		<Grid container>
			<Grid item xs={6}>
				<FormControl component="fieldset">
					<FormLabel component="legend">Select Publication Type</FormLabel>
					<RadioGroup aria-label="publicationType" name="publicationType1" value={publicationType} onChange={handlePublicationTypeChange}>
						{publicationTypeOptions.map(item => (
							<FormControlLabel key={item.value} value={item.value} control={<Radio color="primary"/>} label={item.label}/>
						))}
					</RadioGroup>
				</FormControl>
			</Grid>
			{publicationType === 'isbn-ismn' && getIsbnIsmnElements()}
			{publicationType === 'issn' && getIssnElements()}
			{
				(publicationType === 'isbn-ismn' || publicationType === 'issn') &&
					<Grid item xs={6}>
						<Button variant="contained" color="primary" onClick={handleStatistics}>
							<FormattedMessage id="app.menu.statistics"/>
						</Button>
					</Grid>
			}
		</Grid>
	);

	function getIsbnIsmnElements() {
		const selectedIsbnIsmnTypeOptions = [
			{label: 'Monthly Statistics', value: 'monthlyStatistics'},
			{label: 'ISBN Identification Fields', value: 'isbnIdentificationFields'},
			{label: 'ISMN Identification Fields', value: 'ismnIdentificationFields'},
			{label: 'All ISBN Publishers', value: 'allIsbnPublishers'},
			{label: 'International Registry ISBN Publishers', value: 'internationalRegistryIsbnPublishers'},
			{label: 'Self-published ISBN', value: 'selfPublishedIsbn'},
			{label: 'International Registry ISBN Publishers', value: 'internationalRegistryIsbnPublishers'},
			{label: 'Self-published ISMN', value: 'selfPublishedIsmn'}
		];
		return (
			<Grid container item xs={12}>
				{typeElements(selectedIsbnIsmnType, selectedIsbnIsmnTypeOptions, handleSelectedIsbnIsmnTypeChange)}
				{dateElements()}
			</Grid>
		);
	}

	function getIssnElements() {
		const selectedIssnTypeOptions = [
			{label: 'ISSN', value: 'issn'}
			// {label: 'Publishers', value: 'publishers'},
			// {label: 'Proceedings', value: 'proceedings'},
			// {label: 'Pleading', value: 'pleading'}
		];
		return (
			<Grid container item xs={12}>
				{typeElements(selectedIssnType, selectedIssnTypeOptions, handleSelectedIssnTypeChange)}
				{dateElements()}
			</Grid>
		);
	}

	function dateElements() {
		return (
			<>
				<Grid container item xs={12}>
					<Grid item xs={2}>
						<Typography variant="subtitle1">StartTime :</Typography>
					</Grid>
					<Grid item xs={4}>
						<form noValidate className={classes.dateContainer}>
							<TextField
								id="startDate"
								type="date"
								className={classes.textField}
								InputLabelProps={{
									shrink: true
								}}
								onChange={event => setStartDate(event.target.value)}
							/>
						</form>
					</Grid>
				</Grid>
				<Grid container item xs={12}>
					<Grid item xs={2}>
						<Typography variant="subtitle1">EndTime :</Typography>
					</Grid>
					<Grid item xs={4}>
						<form noValidate className={classes.dateContainer}>
							<TextField
								id="endDate"
								type="date"
								className={classes.textField}
								InputLabelProps={{
									shrink: true
								}}
								onChange={event => setEndDate(event.target.value)}
							/>
						</form>
					</Grid>
				</Grid>
			</>
		);
	}

	function typeElements(value, options, onChange) {
		return (
			<Grid container item xs={12}>
				<Grid item xs={2}>
					<Typography variant="subtitle1">Type :</Typography>
				</Grid>
				<Grid item xs={4}>
					<Select
						labelId="select-type-label"
						id="type"
						value={value}
						onChange={onChange}
					>
						{options.map(item => (
							<MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
						))}
					</Select>
				</Grid>
			</Grid>
		);
	}

	const component = (
		<Grid item xs={12}>
			<Typography variant="h5">
				<FormattedMessage id="statistics.label.heading"/>
			</Typography>
			{elements}
		</Grid>
	);

	return {
		...component
	};
});

function mapStateToProps(state) {
	return ({
		listLoading: state.identifierRanges.rangeListLoading,
		issnStatistics: state.publication.issnStatistics,
		rangeStatistics: state.identifierRanges.statistics
	});
}
