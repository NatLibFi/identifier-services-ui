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
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
	bannerContainer: {
		display: 'flex',
		width: '100%',
		position: 'relative',
		backgroundSize: 'cover',
		height: '500px',
		backgroundColor: '#15141457',
		backgroundBlendMode: 'color',
		'& img': {
			objectFit: 'cover',
			objectPosition: 'top',
			width: '100%',
			height: '100%',
			position: 'absolute',
			zIndex: '-2'
		},
		'& h1': {
			color: '#ffffff',
			margin: '0'
		}
	},
	textContainer: {
		margin: '150px auto',
		maxWidth: '1200px',
		color: '#ffffff',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		alignSelf: 'center',
		'& h5': {
			padding: '20px 0'
		}
	}

});

export default useStyles;
