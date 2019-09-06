import React from 'react';
import {Grid,
	ListItem,
	ListItemText,
	Chip,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Typography} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useStyles from '../styles/listComponent';

export default function (props) {
	const classes = useStyles();

	const {label, value} = props;
	const arr = [];
	function formatObj(value) {
		for (let key in value) {
			if (Object.prototype.hasOwnProperty.call(value, key)) {
				arr.push(formatLabel(key) + ': ' + value[key]);
			}
		}
	}

	function formatLabel(label) {
		const res = label.replace(/([A-Z])/g, ' $1').trim();
		const result = res.charAt(0).toUpperCase() + res.slice(1);
		return result;
	}

	function renderSwitch(value) {
		switch (typeof value) {
			case 'string':
			case 'number':
				return (
					<>
						<Grid item xs={4}>{formatLabel(label)}:</Grid>
						<Grid item xs={8}>{value}</Grid>
					</>
				);
			case 'object':
				if (Array.isArray(value)) {
					if (value.some(item => typeof item === 'string')) {
						return (
							<>
								<Grid item xs={4}>{formatLabel(label)}:</Grid>
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
						<Grid item xs={12}>
							<ExpansionPanel>
								<ExpansionPanelSummary
									expandIcon={<ExpandMoreIcon/>}
									aria-controls="panel1a-content"
									className={classes.exPanel}
								>
									<Typography>{formatLabel(label)}</Typography>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails className={classes.objDetail}>
									{value.map(item => formatObj(item))}
									{arr.map(item => <li key={item}>{item}</li>)}
								</ExpansionPanelDetails>
							</ExpansionPanel>
						</Grid>
					);
				}

				return (
					<Grid item xs={12}>
						<ExpansionPanel>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon/>}
								aria-controls="panel1a-content"
								className={classes.exPanel}
							>
								<Typography>{formatLabel(label)}</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails className={classes.objDetail}>
								{formatObj(value)}
								{arr.map(item => <li key={item}>{item}</li>)}
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</Grid>
				);

			default:
				return null;
		}
	}

	const component = (
		<ListItem>
			<ListItemText>
				<Grid container>
					{renderSwitch(value)}
				</Grid>
			</ListItemText>
		</ListItem>

	);
	return {
		...component
	};
}
