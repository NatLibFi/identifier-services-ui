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
import React, {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {connect} from 'react-redux';
import {
	Grid,
	List,
	Typography,
	ExpansionPanel,
	ExpansionPanelDetails,
	ExpansionPanelSummary
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {FormattedMessage, useIntl} from 'react-intl';

import ListComponent from '../ListComponent';
import Spinner from '../Spinner';
import * as actions from '../../store/actions';

export default connect(mapStateToProps, actions)(props => {
	const {publication, isEdit, isEditable, clearFields, fetchPublisher, fetchedPublisher, publisherLoading, setPublisherEmail} = props;
	const intl = useIntl();
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [publisherName, setPublisherName] = useState(null);

	const {_id, seriesDetails, id, ...formattedPublication} = {...publication, ...publication.seriesDetails};
	const {publisher, ...withoutPublisher} = {...formattedPublication};
	const onlyPublisher = formattedPublication && typeof formattedPublication.publisher === 'object' && formattedPublication.publisher;
	const {organizationDetails, ...formatOnlyPublisher} = {...onlyPublisher, ...onlyPublisher.organizationDetails};

	useEffect(() => {
		if (formattedPublication.publisher !== undefined) {
			fetchPublisher(formattedPublication.publisher, cookie[COOKIE_NAME]);
		}
	}, [cookie, fetchPublisher, formattedPublication.publisher]);

	useEffect(() => {
		if (Object.keys(fetchedPublisher).length > 0) {
			setPublisherName(fetchedPublisher.name);
			setPublisherEmail(fetchedPublisher.email);
		}
	}, [fetchedPublisher, setPublisherEmail]);

	function formatValueforAssociatedRange(value) {
		return value.map(item => item.subRange);
	}

	let publicationDetail;
	if (formattedPublication === undefined || publisherLoading) {
		publicationDetail = <Spinner/>;
	} else {
		publicationDetail = (
			<>
				{typeof formattedPublication.publisher === 'string' ?
					(isEdit ?
						<>
							<Grid item xs={12} md={6}>
								<List>
									{
										Object.keys(formattedPublication).map(key => {
											return typeof formattedPublication[key] === 'string' ?
												(
													<ListComponent clearFields={clearFields} edit={isEditable(key)} fieldName={key} label={intl.formatMessage({id: `publicationRender.label.${key}`})} value={formattedPublication[key]}/>
												) :
												null;
										})
									}
								</List>
							</Grid>
							<Grid item xs={12} md={6}>
								<List>
									{
										Object.keys(formattedPublication).map(key => {
											return typeof formattedPublication[key] === 'object' ?
												(
													<ListComponent clearFields={clearFields} edit={isEditable(key)} fieldName={key} label={intl.formatMessage({id: `publicationRender.label.${key}`})} value={formattedPublication[key]}/>
												) :
												null;
										})
									}
								</List>
							</Grid>
						</> :
						<>
							<Grid item xs={12} md={6}>
								<List>
									{
										Object.keys(formattedPublication).map(key => {
											if (key === 'publisher') {
												return <ListComponent clearFields={clearFields} edit={isEditable(key)} fieldName={key} label={intl.formatMessage({id: `publicationRender.label.${key}`})} value={publisherName !== null && publisherName}/>;
											}

											return typeof formattedPublication[key] === 'string' ?
												(
													<ListComponent label={intl.formatMessage({id: `publicationRender.label.${key}`})} value={formattedPublication[key]}/>
												) :
												null;
										})
									}
								</List>
							</Grid>
							<Grid item xs={12} md={6}>
								<List>
									{
										Object.keys(formattedPublication).map(key => {
											return typeof formattedPublication[key] === 'object' ?
												(
													key === 'associatedRange' ?
														<ListComponent clearFields={clearFields} edit={isEditable(key)} fieldName={key} label={intl.formatMessage({id: `publicationRender.label.${key}`})} value={formatValueforAssociatedRange(formattedPublication[key])}/> :
														<ListComponent label={intl.formatMessage({id: `publicationRender.label.${key}`})} value={formattedPublication[key]}/>
												) :
												null;
										})
									}
								</List>
							</Grid>
						</>
					) : (
						isEdit ?
							(
								<>
									<Grid item xs={12} md={6}>
										<List>
											{
												Object.keys(withoutPublisher).map(key => {
													return <ListComponent key={key} clearFields={clearFields} edit={isEditable(key)} fieldName={key} label={intl.formatMessage({id: `publicationRender.label.${key}`})} value={withoutPublisher[key]}/>;
												})
											}
										</List>
									</Grid>
									<Grid item xs={12} md={6}>
										<ExpansionPanel>
											<ExpansionPanelSummary
												expandIcon={<ExpandMoreIcon/>}
												aria-controls="panel1a-content"
												id="panel1a-header"
											>
												<Typography variant="h6">
													<FormattedMessage id="publicationRender.heading.publisherDetails"/>
												</Typography>
											</ExpansionPanelSummary>
											<ExpansionPanelDetails>
												<List>
													{
														Object.keys(formatOnlyPublisher).map(key => {
															return <ListComponent key={key} clearFields={clearFields} edit={isEditable(key)} fieldName={key} label={intl.formatMessage({id: `publicationRender.label.${key}`})} value={formatOnlyPublisher[key]}/>;
														})
													}
												</List>
											</ExpansionPanelDetails>
										</ExpansionPanel>

									</Grid>
								</>
							) : (
								<>
									<Grid item xs={12} md={6}>
										<List>
											{
												Object.keys(withoutPublisher).map(key => {
													return <ListComponent key={key} label={intl.formatMessage({id: `publicationRender.label.${key}`})} value={withoutPublisher[key]}/>;
												})
											}
										</List>
									</Grid>
									<Grid item xs={12} md={6}>
										<ExpansionPanel>
											<ExpansionPanelSummary
												expandIcon={<ExpandMoreIcon/>}
												aria-controls="panel1a-content"
												id="panel1a-header"
											>
												<Typography variant="h6">
													<FormattedMessage id="publicationRender.heading.publisherDetails"/>
												</Typography>
											</ExpansionPanelSummary>
											<ExpansionPanelDetails>
												<List>
													{
														Object.keys(formatOnlyPublisher).map(key => {
															return <ListComponent key={key} label={intl.formatMessage({id: `publicationRender.label.${key}`})} value={formatOnlyPublisher[key]}/>;
														})
													}
												</List>
											</ExpansionPanelDetails>
										</ExpansionPanel>

									</Grid>
								</>
							)
					)}
			</>
		);
	}

	return publicationDetail;
});

function mapStateToProps(state) {
	return ({
		fetchedPublisher: state.publisher.publisher,
		publisherLoading: state.publisher.loading
	});
}
