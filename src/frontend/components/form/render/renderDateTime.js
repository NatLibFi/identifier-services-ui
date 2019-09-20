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
import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker
} from '@material-ui/pickers';

export default function MaterialUIPickers(props) {
	const {input, className} = props;

	const component = (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<>
				<KeyboardDatePicker
					{...input}
					className={className}
					margin="normal"
					id="date-picker-dialog"
					label="Publication date"
					format="MM/dd/yyyy"
					value={input.value || null}
					KeyboardButtonProps={{
						'aria-label': 'change date'
					}}
					onChange={value => input.onChange(value)}
				/>
				<KeyboardTimePicker
					{...input}
					className={className}
					margin="normal"
					id="time-picker"
					label="Publication time"
					value={input.value || null}
					KeyboardButtonProps={{
						'aria-label': 'change time'
					}}
					onChange={value => input.onChange(value)}
				/>
			</>
		</MuiPickersUtilsProvider>
	);

	return {
		...component
	};
}
