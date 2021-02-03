/* eslint-disable complexity */
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
	Typography
} from '@material-ui/core';
import {useIntl} from 'react-intl';

import ListComponent from '../ListComponent';
import Spinner from '../Spinner';
import * as actions from '../../store/actions';

export default connect(mapStateToProps, actions)(props => {
	const {
		isbnIsmn,
		issn,
		publication,
		isEdit,
		isEditable,
		clearFields,
		fetchPublisher,
		fetchedPublisher,
		publisherLoading,
		setPublisherEmail
	} = props;
	const intl = useIntl();
	/* global COOKIE_NAME */
	const [cookie] = useCookies(COOKIE_NAME);
	const [publisherName, setPublisherName] = useState(null);

	const {_id, seriesDetails, id, ...formattedPublication} = {...publication, ...publication.seriesDetails};

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
				<Grid container item xs={12} spacing={2}>
					{issn && issnElements(publication)}
					{isbnIsmn && isbnIsmnElements(publication)}
				</Grid>
			</>
		);
	}

	return publicationDetail;

	function issnElements(publication) {
		return (
			<>
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h6">
							Basic Informations
						</Typography>
						<hr/>
						<ListComponent edit={isEdit && isEditable} fieldName="title" label={intl.formatMessage({id: 'listComponent.title'})} value={publication.title ? publication.title : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="subtitle" label={intl.formatMessage({id: 'listComponent.subtitle'})} value={publication.subTitle ? publication.subTitle : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="language" label={intl.formatMessage({id: 'listComponent.language'})} value={publication.language ? publication.language : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="manufacturer" label={intl.formatMessage({id: 'listComponent.manufacturer'})} value={publication.manufacturer ? publication.manufacturer : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="city" label={intl.formatMessage({id: 'listComponent.city'})} value={publication.city ? publication.city : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="additionalDetails" label={intl.formatMessage({id: 'listComponent.additionalDetails'})} value={publication.additionalDetails ? publication.additionalDetails : ''}/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Publisher Informations
						</Typography>
						<hr/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.publisherName'})} value={(publication.publisher && publisherName !== null) ? publisherName : ''}/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Main Series
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[mainSeries][title]"
							label={intl.formatMessage({id: 'listComponent.title'})}
							value={publication.seriesDetails ?
								(publication.seriesDetails.mainSeries ?
									(publication.seriesDetails.mainSeries.title ?
										publication.seriesDetails.mainSeries.title :
										''
									) :
									''
								) :	''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[mainSeries][identifier]"
							label={intl.formatMessage({id: 'listComponent.identifier'})}
							value={publication.seriesDetails ?
								(publication.seriesDetails.mainSeries ?
									(publication.seriesDetails.mainSeries.identifier ?
										publication.seriesDetails.mainSeries.identifier :
										''
									) :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Sub Series
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[subSeries][title]"
							label={intl.formatMessage({id: 'listComponent.title'})}
							value={publication.seriesDetails ?
								(publication.seriesDetails.subSeries ?
									(publication.seriesDetails.subSeries.title ?
										publication.seriesDetails.subSeries.title :
										''
									) :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[subSeries][identifier]"
							label={intl.formatMessage({id: 'listComponent.identifier'})}
							value={publication.seriesDetails ?
								(publication.seriesDetails.subSeries ?
									(publication.seriesDetails.subSeries.identifier ?
										publication.seriesDetails.subSeries.identifier :
										''
									) :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Format Details
						</Typography>
						<hr/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.selectFormat'})}
							value={publication.formatDetails ?
								(publication.formatDetails.format ?
									publication.formatDetails.format :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.fileFormat'})}
							value={publication.formatDetails ?
								(publication.formatDetails.fileFormat ?
									publication.formatDetails.fileFormat :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.printFormat'})}
							value={publication.formatDetails ?
								(publication.formatDetails.printFormat ?
									publication.formatDetails.printFormat :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[formatDetails][manufacturer]"
							label={intl.formatMessage({id: 'listComponent.manufacturer'})}
							value={publication.formatDetails ?
								(publication.formatDetails.manufacturer ?
									publication.formatDetails.manufacturer :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[formatDetails][city]"
							label={intl.formatMessage({id: 'listComponent.city'})}
							value={publication.formatDetails ?
								(publication.formatDetails.city ?
									publication.formatDetails.city :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[formatDetails][run]"
							label={intl.formatMessage({id: 'listComponent.run'})}
							value={publication.formatDetails ?
								(publication.formatDetails.run ?
									publication.formatDetails.run :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[formatDetails][edition]"
							label={intl.formatMessage({id: 'listComponent.edition'})}
							value={publication.formatDetails ?
								(publication.formatDetails.edition ?
									publication.formatDetails.edition :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[formatDetails][identifier]"
							label={intl.formatMessage({id: 'listComponent.identifier'})}
							value={publication.formatDetails ?
								(publication.formatDetails.identifier ?
									publication.formatDetails.identifier :
									''
								) : ''}
						/>
					</Grid>
				</Grid>
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h6">
							Time Details
						</Typography>
						<hr/>
						<ListComponent edit={isEdit && isEditable} fieldName="firstYear" label={intl.formatMessage({id: 'listComponent.firstYear'})} value={publication.firstYear ? publication.firstYear : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="firstNumber" label={intl.formatMessage({id: 'listComponent.firstNumber'})} value={publication.firstNumber ? publication.firstNumber : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="frequency" label={intl.formatMessage({id: 'listComponent.frequency'})} value={publication.frequency ? publication.frequency : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="type" label={intl.formatMessage({id: 'listComponent.type'})} value={publication.type ? publication.type : ''}/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Previous Publication
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="previousPublication[lastYear]"
							label={intl.formatMessage({id: 'listComponent.lastYear'})}
							value={publication.previousPublication ?
								(publication.previousPublication.lastYear ?
									publication.previousPublication.lastYear :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="previousPublication[lastNumber]"
							label={intl.formatMessage({id: 'listComponent.lastNumber'})}
							value={publication.previousPublication ?
								(publication.previousPublication.lastNumber ?
									publication.previousPublication.lastNumber :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="previousPublication[title]"
							label={intl.formatMessage({id: 'listComponent.title'})}
							value={publication.previousPublication ?
								(publication.previousPublication.title ?
									publication.previousPublication.title :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="previousPublication[identifier]"
							label={intl.formatMessage({id: 'listComponent.identifier'})}
							value={publication.previousPublication ?
								(publication.previousPublication.identifier ?
									publication.previousPublication.identifier :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Identifier
						</Typography>
						<hr/>
						{
							publication.identifier ?
								publication.identifier.map(item => (
									<div key={publication.identifier.id}>
										<ListComponent label={intl.formatMessage({id: 'listComponent.id'})} value={item.id}/>
										<ListComponent label={intl.formatMessage({id: 'listComponent.type'})} value={item.type}/>
									</div>
								)) :
								<Typography variant="body1">
									Identifier not assigned
								</Typography>
						}
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Metadata References
						</Typography>
						<hr/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.state'})}
							value={publication.metadataReference ?
								(publication.metadataReference.state ?
									publication.metadataReference.state :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.id'})}
							value={publication.metadataReference ?
								(publication.metadataReference.id ?
									publication.metadataReference.id :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Other References
						</Typography>
						<hr/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.associatedRange'})} value={publication.associatedRange ? publication.associatedRange : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.request'})} value={publication.request ? publication.request : ''}/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.lastUpdated'})}
							value={publication.lastUpdated ?
								(publication.lastUpdated.timestamp ?
									publication.lastUpdated.timestamp :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.lastUpdatedBy'})}
							value={publication.lastUpdated ?
								(publication.lastUpdated.user ?
									publication.lastUpdated.user :
									''
								) : ''}
						/>
					</Grid>
				</Grid>
			</>
		);
	}

	function isbnIsmnElements(publication) {
		return (
			<>
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h6">
							Basic Informations
						</Typography>
						<hr/>
						<ListComponent edit={isEdit && isEditable} fieldName="title" label={intl.formatMessage({id: 'listComponent.title'})} value={publication.title ? publication.title : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="subtitle" label={intl.formatMessage({id: 'listComponent.subtitle'})} value={publication.subTitle ? publication.subTitle : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="language" label={intl.formatMessage({id: 'listComponent.language'})} value={publication.language ? publication.language : ''}/>
						<ListComponent edit={isEdit && isEditable} fieldName="publicationTime" label={intl.formatMessage({id: 'listComponent.publicationTime'})} value={publication.publicationTime ? publication.publicationTime : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.publisherName'})} value={(publication.publisher && publisherName !== null) ? publisherName : ''}/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Series Details
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[volume]"
							label={intl.formatMessage({id: 'listComponent.volume'})}
							value={publication.seriesDetails ?
								(publication.seriesDetails.volume ?
									publication.seriesDetails.volume :
									''
								) :	''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[title]"
							label={intl.formatMessage({id: 'listComponent.title'})}
							value={publication.seriesDetails ?
								(publication.seriesDetails.title ?
									publication.seriesDetails.title :
									''
								) :	''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="seriesDetails[identifier]"
							label={intl.formatMessage({id: 'listComponent.identifier'})}
							value={publication.seriesDetails ?
								(publication.seriesDetails.identifier ?
									publication.seriesDetails.identifier :
									''
								) :	''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Uniform Details
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="uniform[name]"
							label={intl.formatMessage({id: 'listComponent.name'})}
							value={publication.uniform && publication.uniform.name ? publication.uniform.name : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="uniform[language]"
							label={intl.formatMessage({id: 'listComponent.language'})}
							value={publication.uniform && publication.uniform.language ? publication.uniform.language : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Format Details
						</Typography>
						<hr/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.selectFormat'})}
							value={publication.formatDetails ?
								(publication.formatDetails.format ?
									publication.formatDetails.format :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.fileFormat'})}
							value={publication.formatDetails ?
								(publication.formatDetails.fileFormat ?
									publication.formatDetails.fileFormat :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.printFormat'})}
							value={publication.formatDetails ?
								(publication.formatDetails.printFormat ?
									publication.formatDetails.printFormat :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="formatDetails[manufacturer]"
							label={intl.formatMessage({id: 'listComponent.manufacturer'})}
							value={publication.formatDetails ?
								(publication.formatDetails.manufacturer ?
									publication.formatDetails.manufacturer :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="formatDetails[city]"
							label={intl.formatMessage({id: 'listComponent.city'})}
							value={publication.formatDetails ?
								(publication.formatDetails.city ?
									publication.formatDetails.city :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="formatDetails[run]"
							label={intl.formatMessage({id: 'listComponent.run'})}
							value={publication.formatDetails ?
								(publication.formatDetails.run ?
									publication.formatDetails.run :
									''
								) : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="formatDetails[edition]"
							label={intl.formatMessage({id: 'listComponent.edition'})}
							value={publication.formatDetails ?
								(publication.formatDetails.edition ?
									publication.formatDetails.edition :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.identifier'})}
							value={publication.formatDetails ?
								(publication.formatDetails.identifier ?
									publication.formatDetails.identifier :
									''
								) : ''}
						/>
					</Grid>
				</Grid>
				<Grid container item xs={6} md={6} spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h6">
							Author Details
						</Typography>
						<hr/>
						<ListComponent
							clearFields={clearFields}
							edit={isEdit && isEditable} fieldName="authors"
							value={publication.authors ? publication.authors : []}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Publication Details
						</Typography>
						<hr/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="isbnClassification"
							label={intl.formatMessage({id: 'listComponent.isbnClassification'})}
							value={publication.isbnClassification ? publication.isbnClassification : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.publicationType'})}
							value={publication.publicationType ? publication.publicationType : ''}
						/>
						<ListComponent
							edit={isEdit && isEditable} fieldName="isPublic"
							label={intl.formatMessage({id: 'listComponent.isPublic'})}
							value={publication.isPublic ? publication.isPublic : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Metadata References
						</Typography>
						<hr/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.type'})} value={publication.type ? publication.type : ''}/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.state'})}
							value={publication.metadataReference ?
								(publication.metadataReference.state ?
									publication.metadataReference.state :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.id'})}
							value={publication.metadataReference ?
								(publication.metadataReference.id ?
									publication.metadataReference.id :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.scale'})}
							value={publication.mapDetails ?
								(publication.mapDetails.scale ?
									publication.mapDetails.scale :
									''
								) : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							Identifier
						</Typography>
						<hr/>
						{
							publication.identifier ?
								publication.identifier.map(item => (
									<div key={publication.identifier.id}>
										<ListComponent label={intl.formatMessage({id: 'listComponent.id'})} value={item.id}/>
										<ListComponent label={intl.formatMessage({id: 'listComponent.type'})} value={item.type}/>
									</div>
								)) :
								<Typography variant="body1">
									Identifier not assigned
								</Typography>
						}
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">
							References
						</Typography>
						<hr/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.associatedRange'})} value={publication.associatedRange ? formatValueforAssociatedRange(publication.associatedRange) : ''}/>
						<ListComponent label={intl.formatMessage({id: 'listComponent.request'})} value={publication.request ? publication.request : ''}/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.lastUpdated'})}
							value={publication.lastUpdated ?
								(publication.lastUpdated.timestamp ?
									publication.lastUpdated.timestamp :
									''
								) : ''}
						/>
						<ListComponent
							label={intl.formatMessage({id: 'listComponent.lastUpdatedBy'})}
							value={publication.lastUpdated ?
								(publication.lastUpdated.user ?
									publication.lastUpdated.user :
									''
								) : ''}
						/>
					</Grid>
				</Grid>
			</>
		);
	}
});

function mapStateToProps(state) {
	return ({
		fetchedPublisher: state.publisher.publisher,
		publisherLoading: state.publisher.loading
	});
}
