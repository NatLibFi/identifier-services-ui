import React from 'react';
import {Grid,
	List,
	ListItem,
	ListItemText,
	Chip,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Typography} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function (props) {
	const {label, value} = props;

	function test(value) {
		var result = '';
		for (var key in value) {
			if (Object.prototype.hasOwnProperty.call(value, key)) {
				result += key + ' , ' + value[key] + '<br />';
			}
		}

		return result;
	}

	function renderSwitch(value) {
		switch (typeof value) {
			case 'string':
			case 'number':
				return (
					<>
						<Grid item xs={4}>{label}:</Grid>
						<Grid item xs={8}>{value}</Grid>
					</>
				);
			case 'object':
				if (Array.isArray(value)) {
					return (
						<>
							<Grid item xs={4}>{label}:</Grid>
							<Grid item xs={8}>
								{value.map(item => {
									return (
										<Chip key={item} label={item}/>
									);
								})}
							</Grid>
						</>
					);
				}

				return (
					<ExpansionPanel>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon/>}
							aria-controls="panel1a-content"
						>
							<Typography>{label}</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<div>{test(value)}</div>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				);

			default:
				return null;
		}
	}

	const component = (
		<>
			<List>
				<ListItem>
					<ListItemText>
						<Grid container>
							{renderSwitch(value)}
						</Grid>
					</ListItemText>
				</ListItem>
			</List>
		</>

	);
	return {
		...component
	};
}
