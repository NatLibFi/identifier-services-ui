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

	function formatLabel(label) {
		const res = label.replace(/([A-Z])/g, ' $1').trim();
		const result = `${res.charAt(0).toUpperCase()}${res.slice(1)}`;
		return result;
	}

	function renderSwitch(value) {
		switch (typeof value) {
			case undefined:
				return undefined;
			case 'string':
			case 'number':
				return (
					<>
						<Grid item xs={4}><span className={classes.label}>{formatLabel(label)}:</span></Grid>
						<Grid item xs={8}>{value}</Grid>
					</>
				);
			case 'boolean':
				return (
					<>
						<Grid item xs={4}><span className={classes.label}>{formatLabel(label)}:</span></Grid>
						<Grid item xs={8}>{value.toString()}</Grid>
					</>
				);
			case 'object':
				return renderObject(value);

			default:
				return null;
		}

		function renderObject(obj) {
			if (obj.length === 0) {
				return null;
			}

			if (Array.isArray(obj)) {
				if (obj.some(item => typeof item === 'string')) {
					return (
						<>
							<Grid item xs={4}><span className={classes.label}>{formatLabel(label)}:</span></Grid>
							<Grid item xs={8}>
								{obj.map(item => {
									return (
										<Chip key={item} label={item}/>
									);
								})}
							</Grid>
						</>
					);
				}

				return renderExpansion(label, obj);
			}

			return renderExpansion(label, obj);
		}

		function renderExpansion(label, value) {
			const component = (
				<Grid item xs={12}>
					<ExpansionPanel>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon/>}
							aria-controls="panel1a-content"
							className={classes.exPanel}
						>
							<Typography><span className={classes.label}>{formatLabel(label)}</span></Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails className={classes.objDetail}>

							{(Array.isArray(value) && value.length > 0) ? (
								value.map(item => (
									<ul key={item} style={{borderBottom: '1px dashed', listStyleType: 'none'}}>
										{Object.keys(item).map(key => item[key] ?
											(
												<li key={key} className={classes.dropDownList}>
													<span className={classes.label}>{formatLabel(key)}: </span>
													<span>{item[key]}</span>
												</li>
											) : null
										)}
									</ul>
								))
							) : (
								Object.entries(value).map(([key, val]) =>
									typeof val === 'object' ?
										renderExpansion(key, val) :

										(
											<li key={key} className={classes.dropDownList}>
												<span className={classes.label}>{formatLabel(key)}: </span>
												<span>{typeof value[key] === 'boolean' ? value[key].toString() : value[key]}</span>
											</li>
										)
								)
							)}
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Grid>
			);

			return component;
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
