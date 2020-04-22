import React from 'react';
import {Grid, Typography} from '@material-ui/core';
import {Field, FieldArray} from 'redux-form';
import renderTextField from '../render/renderTextField';
import renderAliases from '../render/renderAliases';
import renderSelect from '../render/renderSelect';
import renderCheckbox from '../render/renderCheckbox';
import renderMultiSelect from '../render/renderMultiSelect';
import renderContactDetail from '../render/renderContactDetail';
import PopoverComponent from '../../PopoverComponent';
import HelpIcon from '@material-ui/icons/Help';

export function element({array, classes, clearFields, publicationIssnValues}) {
	return array.map(list => {
		switch (list.type) {
			case 'arrayString':
				return (
					<Grid key={list.name} item xs={12}>
						<FieldArray
							className={`${classes.arrayString} ${list.width}`}
							component={renderAliases}
							name={list.name}
							type={list.type}
							label={list.label}
							props={{clearFields, name: list.name, subName: list.subName, classes}}
						/>
					</Grid>
				);
			case 'select':
				return (
					<>
						<Grid key={list.name} item xs={6}>
							<Field
								className={`${classes.selectField} ${list.width}`}
								component={renderSelect}
								label={list.label}
								name={list.name}
								type={list.type}
								options={list.options}
								props={{publicationValues: publicationIssnValues, clearFields}}
							/>
						</Grid>
						{publicationIssnValues && publicationIssnValues.formatDetails && publicationIssnValues.formatDetails.format === 'electronic' ? element({array: getUrl(), classes, clearFields}) : null}
					</>
				);
			case 'multiSelect':
				return (
					<Grid key={list.name} container item xs={6}>
						<Grid item xs={10}>
							<Field
								className={`${classes.selectField} ${list.width}`}
								component={renderMultiSelect}
								label={list.label}
								name={list.name}
								type={list.type}
								options={list.options}
								props={{isMulti: list.isMulti ? list.isMulti : false}}
							/>
						</Grid>
						<Grid item>
							<PopoverComponent icon={<HelpIcon/>} infoText={getClassificationInstruction()}/>
						</Grid>
					</Grid>
				);
			case 'checkbox':
				return (
					<Grid key={list.name} container item xs={6} className={classes.popOver}>
						<Grid item>
							<Field
								component={renderCheckbox}
								label={list.label}
								name={list.name}
								type={list.type}
							/>
						</Grid>
						<PopoverComponent icon={<HelpIcon/>} infoText={list.info}/>
					</Grid>
				);
			case 'number':
				return (
					<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
						<Field
							className={`${classes.textField} ${list.width}`}
							component={renderTextField}
							label={list.label}
							name={list.name}
							type={list.type}
							disabled={Boolean(list.name === 'publisher')}
						/>
					</Grid>
				);
			case 'text':
				if (list.width === 'full') {
					return (
						<Grid key={list.name} item xs={12}>
							<Field
								className={`${classes.textField} ${list.width}`}
								component={renderTextField}
								label={list.label}
								name={list.name}
								type={list.type}
							/>
						</Grid>
					);
				}

				return (
					<Grid key={list.name} item xs={6}>
						<Field
							className={`${classes.textField} ${list.width}`}
							component={renderTextField}
							label={list.label}
							name={list.name}
							type={list.type}
						/>
					</Grid>

				);

			default:
				return null;
		}
	}
	);
}

export function fieldArrayElement({data, fieldName, clearFields}) {
	const comp = (
		<FieldArray
			component={renderContactDetail}
			name={fieldName}
			props={{clearFields, data, fieldName}}
		/>
	);

	return {
		...comp
	};
}

function getClassificationInstruction() {
	return (
		<>
			<Typography>Please click to the field from the attached classification table 1-4 the classes which best describe the subject fields of your publications and enter them in the box below. If your publications cover several subject fields, use 000 General.</Typography>
			<Typography>If you are unable to find a suitable class in the table, you can also describe the contents in your own words (use a few short terms).</Typography>
		</>
	);
}

function getUrl() {
	return [
		{
			label: 'URL*',
			name: 'formatDetails[url]',
			type: 'text',
			width: 'half'
		}
	];
}
