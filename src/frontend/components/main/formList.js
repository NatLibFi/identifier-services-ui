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
import {Typography, Grid} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import useStyles from '../../styles/formList';
import ModalLayout from '../ModalLayout';
import PublisherRegistrationForm from '../form/PublisherRegistrationForm';
import SwitchPublicationForm from '../form/SwitchPublicationForm';
import ContactForm from '../form/ContactForm';

export default withRouter(props => {
	const [dynamicTitle, setDynamicTitle] = React.useState('');
	const formListsArray = [
		{label: <FormattedMessage id="app.home.formButtons.publisherRegistration"/>, title: 'Publisher Registration', name: 'publisherRegistration', component: <PublisherRegistrationForm {...props}/>},
		{label: <FormattedMessage id="app.home.formButtons.publicationRegistration"/>, title: `Publication Registration ${dynamicTitle}`, name: 'publicationRegistration', component: <SwitchPublicationForm title={dynamicTitle} setTitle={setDynamicTitle} {...props}/>},
		{label: <FormattedMessage id="app.home.formButtons.contactForm"/>, title: 'Contact Form', name: 'contactForm', component: <ContactForm {...props}/>}
	];
	const classes = useStyles();
	return (
		<div className={classes.formListContainer}>
			<Grid container spacing={2} className={classes.formContainer}>
				<Grid item xs={12}>
					<Typography variant="h4" align="center"><FormattedMessage id="app.home.formHeading"/></Typography>
				</Grid>

				{formListsArray.map(item => (
					<ModalLayout key={item.label} form label={item.label} title={item.title} dynamicTitle={dynamicTitle} setDynamicTitle={setDynamicTitle} name={item.name} variant="outlined" classed={classes.button} color="primary">
						{item.component}
					</ModalLayout>
				))}
			</Grid>
		</div>
	);
});
