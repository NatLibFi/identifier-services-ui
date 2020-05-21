import React from 'react';
import {Grid, Typography, Box} from '@material-ui/core';
import {Field, FieldArray} from 'redux-form';
import renderTextField from '../render/renderTextField';
import renderAliases from '../render/renderAliases';
import renderSelect from '../render/renderSelect';
import renderDateTime from '../render/renderDateTime';
import renderRadioButton from '../render/renderRadioButton';
import renderCheckbox from '../render/renderCheckbox';
import renderMultiSelect from '../render/renderMultiSelect';
import renderContactDetail from '../render/renderContactDetail';
import renderSelectAutoComplete from '../render/renderSelectAutoComplete';
import PopoverComponent from '../../PopoverComponent';
import HelpIcon from '@material-ui/icons/Help';

export function element({array, classes, clearFields, publicationIssnValues, fieldName, publicationIsbnValues}) {
	return array.map(list => {
		switch (list.type) {
			case 'arrayString':
				return (
					<Grid key={list.name} item xs={list.width === 'half' ? 6 : 12}>
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
			case 'dateTime':
				return (
					<Grid key={list.name} item xs={6}>
						<Field
							className={classes.dateTimePicker}
							component={renderDateTime}
							label={list.label}
							name={list.name}
							type={list.type}
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
								props={{publicationValues: publicationIssnValues || publicationIsbnValues, clearFields}}
							/>
						</Grid>
						{
							publicationIssnValues && publicationIssnValues.formatDetails &&
							(publicationIssnValues.formatDetails.format === 'electronic' || publicationIssnValues.formatDetails.format === 'printed-and-electronic') ?
								element({array: getUrl(), classes, clearFields}) :
								null
						}
					</>
				);
			case 'multiSelect':
				return (
					<Grid key={list.name} container item xs={list.width === 'half' ? 6 : 12}>
						<Grid item xs={12}>
							<Field
								className={`${classes.selectField} ${list.width}`}
								component={renderMultiSelect}
								label={list.label}
								infoIconComponent={list.name === 'classification' && <PopoverComponent icon={<HelpIcon/>} infoText={getClassificationInstruction()}/>}
								name={list.name}
								type={list.type}
								options={list.options}
								creatable={list.isCreatable}
								props={{isMulti: list.isMulti ? list.isMulti : false}}
							/>
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
				return (
					<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
						<Field
							className={`${classes.textField} ${list.width}`}
							component={renderTextField}
							label={list.label}
							name={list.name}
							type={list.type}
							disabled={list.disable}
						/>
					</Grid>

				);

			case 'radio':
				if (fieldName === 'formatDetails') {
					return (
						<>
							<Grid key={list.name} item xs={12}>
								<Box mt={1}><Typography variant="h6">Select the way you want Publication to be issued</Typography></Box>
								<Field
									value={publicationIsbnValues && publicationIsbnValues.selectFormat}
									component={renderRadioButton}
									name={list.name}
									type={list.type}
									options={list.options}
									props={{className: classes.radioDirectionRow, publicationValues: publicationIsbnValues, clearFields: clearFields}}
								/>
							</Grid>
							{publicationIsbnValues && publicationIsbnValues.selectFormat && subElementFormatDetails({value: publicationIsbnValues.selectFormat, classes})}
						</>
					);
				}

				return (
					<Grid key={list.name} item xs={12}>
						<>
							<Field
								value={publicationIsbnValues && publicationIsbnValues.select}
								component={renderRadioButton}
								name={list.name}
								type={list.type}
								options={list.options}
								props={{className: classes.radioDirectionRow, publicationValues: publicationIsbnValues, clearFields: clearFields}}
							/>
						</>

					</Grid>
				);

			case 'selectAutoComplete':
				return (
					<>
						<Grid key={list.name} item xs={list.width === 'full' ? 12 : 6}>
							<Field
								disableClearable
								freeSolo
								className={`${classes.selectField} ${list.width}`}
								name={list.name}
								component={renderSelectAutoComplete}
								placeholder={list.placeholder}
								label={list.label}
								options={list.options}
								disabled={list.disable}
							/>
						</Grid>
					</>
				);

			default:
				return null;
		}
	}
	);
}

export function fieldArrayElement({data, fieldName, clearFields, formName}) {
	const comp = (
		<FieldArray
			component={renderContactDetail}
			name={fieldName}
			props={{clearFields, data, fieldName, formName}}
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

function subElementFormatDetails({value, classes}) {
	const array = getSubFormatDetailsFieldArray();
	switch (value) {
		case 'electronic':
			return element({array: array[0].electronic, fieldName: 'electronic', classes});
		case 'printed':
			return element({array: array[1].printed, fieldName: 'printed', classes});
		case 'both':
			return element({array: array[2].both, fieldName: 'both', classes});
		default:
			return null;
	}
}

function getSubFormatDetailsFieldArray() {
	const array = [
		{
			electronic: [
				{
					label: 'Fileformat*',
					name: 'formatDetails[fileFormat]',
					type: 'multiSelect',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'Pdf', value: 'pdf'},
						{label: 'Epub', value: 'epbu'},
						{label: 'CD', value: 'cd'},
						{label: 'MP3', value: 'mp3'}
					]
				}
			]
		},
		{
			printed: [
				{
					label: 'PrintFormat*',
					name: 'formatDetails[printFormat]',
					type: 'select',
					width: 'half',
					options: [
						{label: '', value: ''},
						{label: 'paperback', value: 'paperback'},
						{label: 'hardback', value: 'hardback'},
						{label: 'spiral-binding', value: 'spiral-binding'}
					]
				},
				{
					label: 'Manufacturer',
					name: 'formatDetails[manufacturer]',
					type: 'text',
					width: 'half'
				},
				{
					label: 'city',
					name: 'formatDetails[city]',
					type: 'text',
					width: 'half'
				},
				{
					label: 'Run',
					name: 'formatDetails[run]',
					type: 'number',
					width: 'half'
				},
				{
					label: 'Edition',
					name: 'formatDetails[edition]',
					type: 'number',
					width: 'half'
				}
			]
		},
		{
			both: [
				{
					label: 'Fileformat*',
					name: 'formatDetails[fileFormat]',
					type: 'multiSelect',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'Pdf', value: 'pdf'},
						{label: 'Epub', value: 'epbu'},
						{label: 'CD', value: 'cd'},
						{label: 'MP3', value: 'mp3'}
					]
				},
				{
					label: 'PrintFormat*',
					name: 'formatDetails[printFormat]',
					type: 'select',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'paperback', value: 'paperback'},
						{label: 'hardback', value: 'hardback'},
						{label: 'spiral-binding', value: 'spiral-binding'}
					]
				},
				{
					label: 'Manufacturer',
					name: 'formatDetails[manufacturer]',
					type: 'text',
					width: 'half'
				},
				{
					label: 'city',
					name: 'formatDetails[city]',
					type: 'text',
					width: 'half'
				},
				{
					label: 'Run',
					name: 'formatDetails[run]',
					type: 'number',
					width: 'half'
				},
				{
					label: 'Edition',
					name: 'formatDetails[edition]',
					type: 'number',
					width: 'half'
				}
			]
		}
	];
	return array;
}

export function formatAddress(obj) {
	const result = Object.keys(obj).reduce((acc, key) => {
		return {...acc, [replaceKey(key)]: obj[key]};
	}, {});
	return result;
}

// eslint-disable-next-line complexity
function replaceKey(key) {
	switch (key) {
		case 'affiliateOfAddress':
		case 'affiliatesAddress':
		case 'distributorAddress':
		case 'distributorOfAddress':
			return 'address';
		case 'affiliateOfAddressDetails':
		case 'affiliatesAddressDetails':
		case 'distributorAddressDetails':
		case 'distributorOfAddressDetails':
			return 'addressDetails';
		case 'affiliateOfCity':
		case 'affiliatesCity':
		case 'distributorCity':
		case 'distributorOfCity':
			return 'city';
		case 'affiliateOfName':
		case 'affiliatesName':
		case 'distributorName':
		case 'distributorOfName':
			return 'name';
		case 'affiliateOfZip':
		case 'affiliatesZip':
		case 'distributorZip':
		case 'distributorOfZip':
			return 'zip';
		default:
			return null;
	}
}

export function formatLabel(label) {
	const res = label[0].replace(/([A-Z])/g, ' $1').trim();
	const result = `${res.charAt(0).toUpperCase()}${res.slice(1)}`;
	return result;
}
