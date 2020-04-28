import React from 'react';
import {TextField, Typography} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';

export default function (props) {
	const {
		label,
		input,
		options,
		className,
		className2,
		disableClearable,
		freeSolo,
		placeholder,
		height,
		width,
		meta: {touched, error}, ...custom} = props;

	const component = (
		<>
			{label && <Typography variant="h6">{label}</Typography>}

			<Autocomplete
				{...input}
				disableClearable={!disableClearable}
				freeSolo={!freeSolo}
				options={options}
				getOptionLabel={option => option.name || option.title}
				renderInput={params => (
					<TextField {...params} className={className2} placeholder={placeholder} variant="outlined"/>
				)}
				className={className}
				value={input.value}
				onBlur={() => input.onBlur(input.value)}
				onChange={(event, value) => {
					input.onChange(value);
				}}
			/>
		</>
	);
	return {
		...component
	};
}