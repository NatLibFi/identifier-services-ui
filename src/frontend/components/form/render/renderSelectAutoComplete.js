import React from 'react';
import {TextField, Typography} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';

export default function (props) {
	const {
		label,
		input,
		options,
		className,
		disableClearable,
		freeSolo,
		placeholder,
		disabled
	} = props;
	const component = (
		<>
			{label && <Typography variant="h6">{label}</Typography>}

			<Autocomplete
				{...input}
				disableClearable={!disableClearable}
				freeSolo={!freeSolo}
				disabled={disabled}
				options={options}
				getOptionLabel={option => option.title}
				renderInput={params => (
					<TextField {...params} className={className} placeholder={placeholder} variant="outlined"/>
				)}
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
