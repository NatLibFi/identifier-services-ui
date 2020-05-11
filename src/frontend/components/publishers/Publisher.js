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
	Button,
	Grid,
	List,
	ListItem,
	ListItemText,
	Typography,
	Fab
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import {reduxForm, Field} from 'redux-form';
import {useCookies} from 'react-cookie';

import {commonStyles} from '../../styles/app';
import useFormStyles from '../../styles/form';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {validate} from '@natlibfi/identifier-services-commons';
import ModalLayout from '../ModalLayout';
import Spinner from '../Spinner';
import renderTextField from '../form/render/renderTextField';
import ListComponent from '../ListComponent';
import TableComponent from '../publishersRequests/TableComponent';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

export default connect(mapStateToProps, actions)(reduxForm({
	form: 'publisherUpdateForm',
	validate,
	enableReinitialize: true
})(props => {
	const {
		fetchPublisher,
		updatePublisher,
		id,
		publisher,
		loading,
		handleSubmit,
		fetchIDRIsbnList,
		fetchIDRIsmnList,
		rangleListLoading,
		isbnRangeList,
		ismnRangeList,
		isAuthenticated,
		userInfo} = props;
	const classes = commonStyles();
	const formClasses = useFormStyles();
	const [isEdit, setIsEdit] = useState(false);
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [assignRange, setAssignRange] = useState(false);
	const [rangeType, setRangeType] = useState('');
	const [isbnValue, setIsbnValue] = React.useState('');
	const [ismnValue, setIsmnValue] = React.useState('');

	const activeCheck = {
		checked: true
	};

	useEffect(() => {
		if (id !== null) {
			fetchPublisher(id, cookie[COOKIE_NAME]);
		}
	}, [cookie, fetchPublisher, id]);
	const handleEditClick = () => {
		setIsEdit(true);
	};

	const handleCancel = () => {
		setIsEdit(false);
	};

	const {organizationDetails, _id, ...formattedPublisherDetail} = {...publisher, ...publisher.organizationDetails, notes: publisher && publisher.notes && publisher.notes.map(item => {
		return {note: Buffer.from(item).toString('base64')};
	})};
	let publisherDetail;
	if ((Object.keys(publisher).length === 0) || loading) {
		publisherDetail = <Spinner/>;
	} else {
		publisherDetail = (
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
									Object.keys(formattedPublisherDetail).map(key => {
										return typeof formattedPublisherDetail[key] === 'string' ?
											(
												<ListComponent label={key} value={formattedPublisherDetail[key]}/>
											) :
											null;
									})
								}
							</List>
						</Grid>
						<Grid item xs={12} md={6}>
							<List>
								{
									Object.keys(formattedPublisherDetail).map(key => {
										return typeof formattedPublisherDetail[key] === 'object' ?
											(
												<ListComponent label={key} value={formattedPublisherDetail[key]}/>
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

	const handlePublisherUpdate = values => {
		const token = cookie[COOKIE_NAME];
		const {_id, ...updateValues} = values;
		updatePublisher(id, updateValues, token);
		setIsEdit(false);
	};

	const handleRangeUpdate = () => {
		const token = cookie[COOKIE_NAME];
		const {_id, ...publisherWithRange} = {
			...publisher,
			isbnRange: isbnValue,
			ismnRange: ismnValue
		};
		updatePublisher(_id, publisherWithRange, token);
	};

	function handleRange() {
		setIsbnValue(publisher.isbnRange);
		setIsmnValue(publisher.ismnRange);
		setAssignRange(!assignRange);
	}

	function displayISBNRanges(type) {
		setRangeType(type);
		fetchIDRIsbnList({searchText: '', token: cookie[COOKIE_NAME], offset: null, activeCheck: activeCheck});
	}

	function displayISMNRanges(type) {
		setRangeType(type);
		fetchIDRIsmnList({searchText: '', token: cookie[COOKIE_NAME], offset: null, activeCheck: activeCheck});
	}

	function handleChange(e, val) {
		if (val === 'isbn') {
			setIsbnValue(e.target.value);
		}

		if (val === 'ismn') {
			setIsmnValue(e.target.value);
		}
	}

	function displayRanges(val) {
		if (val === 'isbn') {
			let data;
			if (rangleListLoading) {
				data = <Spinner/>;
			} else if (isbnRangeList.length === 0) {
				data = 'No ranges found';
			} else {
				data = (
					<TableComponent data={isbnRangeList} value={isbnValue} handleChange={e => handleChange(e, 'isbn')}/>
				);
			}

			return data;
		}

		if (val === 'ismn') {
			let data;
			if (rangleListLoading) {
				data = <Spinner/>;
			} else if (ismnRangeList.length === 0) {
				data = 'No ranges found';
			} else {
				data = (
					<TableComponent data={ismnRangeList} value={ismnValue} handleChange={e => handleChange(e, 'ismn')}/>
				);
			}

			return data;
		}

		return <Typography variant="h6">Choose range to assign</Typography>;
	}

	const component = (
		<ModalLayout isTableRow color="primary" title="Publisher Detail" {...props}>
			{isEdit ?
				<div className={classes.listItem}>
					<form>
						<Grid container spacing={3} className={classes.listItemSpinner}>
							{publisherDetail}
						</Grid>
						<div className={classes.btnContainer}>
							<Button onClick={handleCancel}>Cancel</Button>
							<Button variant="contained" color="primary" onClick={handleSubmit(handlePublisherUpdate)}>
								UPDATE
							</Button>
						</div>
					</form>
				</div> :
				<div className={classes.listItem}>
					{assignRange ?
						<div className={classes.listItem}>
							<Button
								variant="outlined"
								startIcon={<ArrowBackIosIcon/>}
								onClick={handleRange}
							>
								Back
							</Button>&nbsp;
							<Button variant="outlined" color="primary" onClick={() => displayISBNRanges('isbn')}>ISBN Ranges</Button>&nbsp;
							<Button variant="outlined" color="primary" onClick={() => displayISMNRanges('ismn')}>ISMN Ranges</Button>
							{displayRanges(rangeType)}
							{rangeType ? <Button variant="outlined" color="primary" onClick={handleRangeUpdate}>Update {rangeType}</Button> : null}
						</div> :
						<>
							<Grid container spacing={3} className={classes.listItemSpinner}>
								{publisherDetail}
							</Grid>
							{isAuthenticated && userInfo.role === 'admin' && <Button variant="outlined" color="primary" onClick={handleRange}>Assign Ranges</Button>}
							{isAuthenticated && userInfo.role === 'publisher' &&
								<div className={classes.btnContainer}>
									<Fab
										color="primary"
										size="small"
										title="Edit Publisher Detail"
										onClick={handleEditClick}
									>
										<EditIcon/>
									</Fab>
								</div>}
						</>}
				</div>}
		</ModalLayout>
	);
	return {
		...component
	};
}));

function mapStateToProps(state) {
	return ({
		publisher: state.publisher.publisher,
		loading: state.publisher.loading,
		initialValues: state.publisher.publisher,
		isAuthenticated: state.login.isAuthenticated,
		userInfo: state.login.userInfo,
		rangleListLoading: state.identifierRanges.listLoading,
		isbnRangeList: state.identifierRanges.isbnList,
		ismnRangeList: state.identifierRanges.ismnList
	});
}
