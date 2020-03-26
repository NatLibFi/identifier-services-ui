import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	RadioGroup,
	Radio,
	FormControlLabel
} from '@material-ui/core';

export default function TableComponent(props) {
	const {data, value, handleChange} = props;

	const comp = (
		<div>
			<Table aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Prefix</TableCell>
						<TableCell align="right">Range start</TableCell>
						<TableCell align="right">Range end</TableCell>
						<TableCell align="right">Assign Range</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map(row => (
						<TableRow key={row.id}>
							<TableCell component="th" scope="row">{row.prefix}</TableCell>
							<TableCell align="right">{row.rangeStart}</TableCell>
							<TableCell align="right">{row.rangeEnd}</TableCell>
							<TableCell align="right">
								<RadioGroup aria-label="ranges" name="range" value={value} onChange={handleChange}>
									<FormControlLabel value={row.id} control={<Radio color="primary"/>}/>
								</RadioGroup>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);

	return {
		...comp
	};
}
