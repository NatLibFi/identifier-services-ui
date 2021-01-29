/* eslint-disable complexity */
import React from 'react';
import {Grid, Typography, Box} from '@material-ui/core';
import {Field, FieldArray} from 'redux-form';
import {FormattedMessage} from 'react-intl';
import renderTextField from '../render/renderTextField';
import renderAliases from '../render/renderAliases';
import renderDateTime from '../render/renderDateTime';
import renderRadioButton from '../render/renderRadioButton';
import renderCheckbox from '../render/renderCheckbox';
import renderMultiSelect from '../render/renderMultiSelect';
import renderContactDetail from '../render/renderContactDetail';
import renderSelectAutoComplete from '../render/renderSelectAutoComplete';
import PopoverComponent from '../../PopoverComponent';
import HelpIcon from '@material-ui/icons/Help';
import {classificationCodes} from './formFieldVariable';

export function element({array, classes, clearFields, publicationIssnValues, fieldName, publicationIsbnValues, intl}) {
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
							views={list.views}
						/>
					</Grid>
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
							{
								publicationIssnValues && publicationIssnValues.issnFormatDetails &&
								(publicationIssnValues.issnFormatDetails.some(item => item.value === 'online')) ?
									element({array: getUrl(), classes, clearFields}) :
									null
							}
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
							min={0}
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
								<Box mt={1}>
									<Typography variant="h6">
										<FormattedMessage id="publicationRegistration.form.formatDetails.select.label"/>
									</Typography>
								</Box>

								<Field
									value={publicationIsbnValues && publicationIsbnValues.selectFormat}
									component={renderRadioButton}
									name={list.name}
									type={list.type}
									options={list.options}
									props={{className: classes.radioDirectionRow, publicationValues: publicationIsbnValues, clearFields: clearFields}}
								/>
							</Grid>
							{publicationIsbnValues && publicationIsbnValues.selectFormat && subElementFormatDetails({value: publicationIsbnValues.selectFormat, classes, intl})}
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

export function fieldArrayElement({data, fieldName, clearFields, formName, publication}) {
	const comp = (
		<FieldArray
			component={renderContactDetail}
			name={fieldName}
			props={{clearFields, data, fieldName, formName, publication}}
		/>
	);

	return {
		...comp
	};
}

function getClassificationInstruction() {
	return (
		<>
			<Typography>
				<FormattedMessage id="publisherRegistration.form.classificationInstruction1"/>
			</Typography>
			<Typography>
				<FormattedMessage id="publisherRegistration.form.classificationInstruction2"/>
			</Typography>
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

function subElementFormatDetails({value, classes, intl}) {
	const array = getSubFormatDetailsFieldArray(intl);
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

function getSubFormatDetailsFieldArray(intl) {
	const array = [
		{
			electronic: [
				{
					isMulti: true,
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.fileformat'}),
					name: 'formatDetails[fileFormat]',
					type: 'multiSelect',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'Pdf', value: 'pdf'},
						{label: 'Epub', value: 'epub'},
						{label: 'CD', value: 'cd'},
						{label: 'MP3', value: 'mp3'}
					]
				}
			]
		},
		{
			printed: [
				{
					isMulti: true,
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printformat'}),
					name: 'formatDetails[printFormat]',
					type: 'multiSelect',
					width: 'half',
					options: [
						{label: '', value: ''},
						{label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.printformat.paperback'}), value: 'paperback'},
						{label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.printformat.hardback'}), value: 'hardback'},
						{label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.printformat.spiral-binding'}), value: 'spiral-binding'}
					]
				},
				{
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.manufacturer'}),
					name: 'formatDetails[manufacturer]',
					type: 'text',
					width: 'half'
				},
				{
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.city'}),
					name: 'formatDetails[city]',
					type: 'text',
					width: 'half'
				},
				{
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.run'}),
					name: 'formatDetails[run]',
					type: 'number',
					width: 'half'
				},
				{
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.edition'}),
					name: 'formatDetails[edition]',
					type: 'number',
					width: 'half'
				}
			]
		},
		{
			both: [
				{
					isMulti: true,
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.fileformat'}),
					name: 'formatDetails[fileFormat]',
					type: 'multiSelect',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: 'Pdf', value: 'pdf'},
						{label: 'Epub', value: 'epub'},
						{label: 'CD', value: 'cd'},
						{label: 'MP3', value: 'mp3'}
					]
				},
				{
					isMulti: true,
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printformat'}),
					name: 'formatDetails[printFormat]',
					type: 'multiSelect',
					width: 'full',
					options: [
						{label: '', value: ''},
						{label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.printformat.paperback'}), value: 'paperback'},
						{label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.printformat.hardback'}), value: 'hardback'},
						{label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.printformat.spiral-binding'}), value: 'spiral-binding'}
					]
				},
				{
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.manufacturer'}),
					name: 'formatDetails[manufacturer]',
					type: 'text',
					width: 'half'
				},
				{
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.city'}),
					name: 'formatDetails[city]',
					type: 'text',
					width: 'half'
				},
				{
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.run'}),
					name: 'formatDetails[run]',
					type: 'number',
					width: 'half'
				},
				{
					label: intl.formatMessage({id: 'publicationRegistration.form.formatDetails.printed.edition'}),
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

export function formatClassificationDefaultValue(arr) {
	return arr.reduce((acc, item) => {
		classificationCodes.map(obj => { // eslint-disable-line array-callback-return
			if (obj.value.toString() === item.toString()) {
				acc.push(obj);
			}
		});
		return acc;
	}, []);
}

