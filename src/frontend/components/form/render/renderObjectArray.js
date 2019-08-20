/* eslint-disable no-unused-expressions */
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
import {Field, getFormValues} from 'redux-form';
import {Fab, Grid, Chip} from '@material-ui/core';
import {PropTypes} from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import {connect} from 'react-redux';
import useStyles from '../../../styles/form';

import renderTextField from './renderTextField';
import renderSelect from './renderSelect';

export default connect(state => ({
	values: getFormValues('userCreation')(state)

}))(props => {
	const classes = useStyles();
	const [errors, setErrors] = useState();
	const {fields, values, clearFields, list: {name, subName}} = props;
	const email = values && {
		value: values.value,
		type: values.type
	};

	const handleAliasesClick = () => {
		setErrors();
		(values && values !== '') ?
			subName.every(item => values[item.name] !== undefined) ?
				(values[name] ?
					(values[name].some(item => values.value === item.value) ?
						setErrors('Already Exist') :
						fields.push(email) && subName.forEach(item => clearFields(undefined, false, item.name))) :
					fields.push(email) && subName.forEach(item => clearFields(undefined, false, item.name))) :
				null :
			setErrors('Required');
	};

	const component = (
		<>
			<Grid>
				<Grid item style={{display: 'flex'}}>
					{
						subName.map(item => (
							(item.type === 'select') ?
								<Field
									key={item.label}
									className={`${classes.textField} ${classes[`${item.className}`]}`}
									component={renderSelect}
									label={item.label}
									name={item.name}
									type={item.type}
									options={item.option}
								/>	:
								<Field
									key={item.label}
									className={classes[`${item.className}`]}
									name={item.name}
									type="text"
									component={renderTextField}
									label={item.label}
									props={{errors}}
								/>
						))
					}
					<Fab
						color="primary"
						aria-label="Add"
						size="small"
						onClick={handleAliasesClick}
					>
						<AddIcon/>
					</Fab>
				</Grid>
			</Grid>
			{values && values[name] && values[name].map((item, index) => (
				<Chip
					key={item.value}
					label={item.value}
					onDelete={() => fields.remove(index)}
				/>
			))}
		</>
	);

	return {
		...component,
		defaultProps: {
			meta: {}
		},
		propTypes: {
			fields: PropTypes.arrayOf(PropTypes.shape({})),
			meta: PropTypes.shape({touched: PropTypes.bool, error: PropTypes.bool})
		}
	};
});
