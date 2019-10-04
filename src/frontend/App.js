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
import CssBaseline from '@material-ui/core/CssBaseline';
import {Switch, Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {IntlProvider} from 'react-intl';
import {useCookies} from 'react-cookie';

import Home from './components/main';
import TopNav from './components/navbar/topNav';
import AdminNav from './components/navbar/adminNav';
import Publisher from './components/publishers/Publisher';
import PublishersList from './components/publishers/PublishersList';
import PublisherRequest from './components/publishersRequests/publisherRequest';
import User from './components/users/User';
import UsersList from './components/users/UsersList';
import IsbnIsmn from './components/publication/isbnIsmn/IsbnIsmn';
import IsbnIsmnList from './components/publication/isbnIsmn/IsbnIsmnList';
import Issn from './components/publication/issn/Issn';
import IssnList from './components/publication/issn/IssnList';
import UsersRequest from './components/usersRequests/UsersRequest';
import UsersRequestsList from './components/usersRequests/UsersRequestsList';
import Message from './components/messageTemplates/Message';
import MessagesList from './components/messageTemplates/MessagesList';
import PublishersRequestsList from './components/publishersRequests/PublishersRequestsList';
import PublicationIsbnIsmnRequestList from './components/publicationRequests/isbnIsmRequest/IsbnIsmnRequestList';
import PublicationIsbnIsmnRequest from './components/publicationRequests/isbnIsmRequest/IsbnIsmnRequest';
import IssnRequestList from './components/publicationRequests/issnRequest/IssnRequestList';
import IssnRequest from './components/publicationRequests/issnRequest/IssnRequest';
import Footer from './components/footer';
import PrivateRoute from './components/PrivateRoutes';
import theme from './styles/app';
import Tooltips from './components/Tooltips';
import enMessages from './intl/translations/en.json';
import fiMessages from './intl/translations/fi.json';
import svMessages from './intl/translations/sv.json';
import SnackBar from './components/SnackBar';
import * as actions from './store/actions';

export default connect(mapStateToProps, actions)(withRouter(props => {
	const {lang, userInfo, isAuthenticated, history, location, responseMessage} = props;
	const {modal} = location.state !== undefined && location.state;
	const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
	const [cookie] = useCookies('login-cookie');
	const token = cookie['login-cookie'];

	useEffect(() => {
		setIsAuthenticatedState(isAuthenticated);
	}, [isAuthenticated, token]);

	const routeField = [
		{path: '/', component: Home},
		{path: '/publishers', component: PublishersList},
		{path: '/publishers/:id', component: PublishersList}
	];

	const privateRoutesList = [
		{path: '/users', role: ['admin', 'publisherAdmin', 'publisher', 'system'], component: UsersList},
		{path: '/users/:id', role: ['admin', 'publisherAdmin', 'publisher', 'system'], component: UsersList},
		{path: '/publications/isbn-ismn', role: ['admin', 'publisherAdmin', 'publisher', 'system'], component: IsbnIsmnList},
		{path: '/publication/isbn-ismn/:id', role: ['admin', 'publisherAdmin', 'publisher', 'system'], component: IsbnIsmnList},
		{path: '/publications/issn', role: ['admin', 'publisherAdmin', 'publisher', 'system'], component: IssnList},
		{path: '/publication/issn/:id', role: ['admin', 'publisherAdmin', 'publisher', 'system'], component: IssnList},
		{path: '/requests/users', role: ['admin', 'publisherAdmin'], component: UsersRequestsList},
		{path: '/requests/users/:id', role: ['admin', 'publisherAdmin'], component: UsersRequestsList},
		{path: '/templates', role: ['admin'], component: MessagesList},
		{path: '/templates/:id', role: ['admin'], component: MessagesList},
		{path: '/requests/publishers', role: ['publisher', 'admin'], component: PublishersRequestsList},
		{path: '/requests/publishers/:id', role: ['system', 'admin'], component: PublishersRequestsList},
		{path: '/requests/publications/isbn-ismn', role: ['publisher', 'admin'], component: PublicationIsbnIsmnRequestList},
		{path: '/requests/publications/isbn-ismn/:id', role: ['publisher', 'admin'], component: PublicationIsbnIsmnRequestList},
		{path: '/requests/publications/issn', role: ['publisher', 'admin'], component: IssnRequestList},
		{path: '/requests/publications/issn/:id', role: ['publisher', 'admin'], component: IssnRequestList}

	];

	const routes = (
		<>
			{routeField.map(fields => (
				<Route
					key={fields.path}
					exact
					path={fields.path}
					render={props => <fields.component {...props}/>}
				/>
			))}
			{privateRoutesList.map(pRoute => (
				<PrivateRoute
					key={pRoute.path}
					exact
					role={pRoute.role}
					path={pRoute.path}
					component={pRoute.component}
				/>
			))}
		</>
	);

	const translations = {
		fi: fiMessages,
		en: enMessages,
		sv: svMessages

	};

	const component = (
		<IntlProvider locale={lang} messages={translations[lang]}>
			<MuiThemeProvider theme={theme}>
				<TopNav userInfo={userInfo} isAuthenticated={isAuthenticatedState} history={history}/>
				<CssBaseline/>
				<AdminNav userInfo={userInfo} isAuthenticated={isAuthenticatedState}/>
				<section style={{minHeight: '80vh'}}>
					{
						isAuthenticatedState ? (userInfo.role.includes('publisher')) &&
						<Tooltips label="contact form" title="contactForm"/> :
							null
					}
					<Switch>
						{routes}
					</Switch>
					{modal ? <Route path="/publishers/:id" component={Publisher}/> : null}
					{modal ? <Route path="/publication/isbn-ismn/:id" component={IsbnIsmn}/> : null}
					{modal ? <Route path="/publication/issn/:id" component={Issn}/> : null}
					{modal ? <Route path="/requests/publishers/:id" component={PublisherRequest}/> : null}
					{modal ? <Route path="/requests/publications/isbn-ismn/:id" component={PublicationIsbnIsmnRequest}/> : null}
					{modal ? <Route path="/requests/publications/issn/:id" component={IssnRequest}/> : null}
					{modal ? <Route path="/users/:id" component={User}/> : null}
					{modal ? <Route path="/requests/users/:id" component={UsersRequest}/> : null}
					{modal ? <Route path="/templates/:id" component={Message}/> : null}

					{responseMessage && <SnackBar variant={responseMessage.color} openSnackBar={Boolean(responseMessage)} {...props}/>}
				</section>
				<Footer/>
			</MuiThemeProvider>
		</IntlProvider>
	);
	return {
		...component
	};
}));

function mapStateToProps(state) {
	return {
		lang: state.locale.lang,
		responseMessage: state.contact.responseMessage,
		isAuthenticated: state.login.isAuthenticated,
		userInfo: state.login.userInfo
	};
}
