import React from 'react';
import Banner from './banner';
import FormList from './formList';
import IsbnIsmn from './isbn_ismn';
import Issn from './issn';
import SearchComponent from './renderSearchComponent';

export default function () {
	return (
		<>
			<Banner/>
			<SearchComponent/>
			<FormList/>
			<IsbnIsmn/>
			<Issn/>
		</>
	);
}
