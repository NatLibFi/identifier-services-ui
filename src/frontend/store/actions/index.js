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

export {
	fetchPublisher,
	fetchPublisherOption,
	updatePublisher,
	searchPublisher,
	publisherCreationRequest,
	fetchPublishersRequestsList,
	fetchPublisherRequest,
	updatePublisherRequest,
	getUniversityPublisher
} from './publisherAction';

export {
	normalLogin,
	getUserInfo,
	logOut
} from './auth';

export {
	sendMessage,
	createMessageTemplate,
	fetchMessagesList,
	fetchAllMessagesList,
	fetchMessage,
	updateMessageTemplate
} from './messageActions';

export {
	setLocale
} from './localeAction';

export {
	success,
	fail,
	setLoader,
	loadSvgCaptcha,
	postCaptchaInput,
	setFormName,
	setMessage,
	getNotification,
	exportXLS
} from './commonAction';

export {
	createUser,
	createUserRequest,
	fetchUser,
	fetchUserRequest,
	findUserByUserId,
	fetchUsersList,
	fetchUsersRequestsList,
	updateUserRequest,
	updateUser,
	deleteUser
} from './userActions';

export {
	passwordResetForm,
	passwordReset,
	decryptToken,
	decodeToken
} from './passwordResetAction';

export {
	fetchIsbnIsmn,
	fetchIsbnIsmnList,
	updatePublicationIsbnIsmn,
	fetchIssn,
	fetchIssnList,
	updatePublicationIssn,
	publicationCreation,
	publicationCreationRequest,
	fetchPublicationIsbnIsmnRequestsList,
	fetchPublicationIsbnIsmnRequest,
	updatePublicationIsbnIsmnRequest,
	fetchIssnRequestsList,
	fetchIssnRequest,
	fetchIssnStatistics,
	updateIssnRequest
} from './publicationAction';

export {
	fetchIDR,
	fetchIDRList,
	searchIDRList,
	fetchIdentifier,
	createNewRange,
	createIsbnIsmnRange,
	createIsbnIsmnBatch,
	assignIssnRange,
	fetchIDRIsbnList,
	fetchIDRIsbn,
	fetchIDRIsmnList,
	fetchIDRIsmn,
	fetchIDRIssnList,
	fetchIDRIssn,
	fetchRangeStatistics,
	createIssnRange,
	createIsbnRange,
	createIsmnRange,
	updateIsbnRange,
	updateIsmnRange
} from './identifierRangesActions';
