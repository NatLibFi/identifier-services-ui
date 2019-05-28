import React from 'react';
import {withStyles, createMuiTheme} from '@material-ui/core';
import styles from './styles/app';
import TopNav from './components/navbar/topNav/index';
import CssBaseline from '@material-ui/core/CssBaseline';
import Banner from './components/main/banner';
import FormList from './components/main/formList';
import IsbnIsmn from './components/main/isbn_ismn';
import Issn from './components/main/issn';
import Footer from './components/footer';
import {MuiThemeProvider} from '@material-ui/core/styles';
import SearchComponent from './components/main/searchComponent';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#00224f'
		}
	},
	typography: {
		fontFamily: 'Poppins'
	}
});

const App = () => {
	return (
		<MuiThemeProvider theme={theme}>
			<TopNav/>
			<CssBaseline/>
			<Banner/>
			<SearchComponent/>
			<FormList/>
			<IsbnIsmn/>
			<Issn/>
			<Footer/>
		</MuiThemeProvider>
	);
};

export default withStyles(styles)(App);
