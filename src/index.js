import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter} from 'react-router-dom';
import App from './components/App';
import './styles/app.css';
import './styles/img/favicon.ico';
import UserConfirmation from "./components/UserConfirmation";

render(
		 (<BrowserRouter  getUserConfirmation={(message, callback) =>  UserConfirmation(message, callback)}>
		 	<App/>
		  </BrowserRouter>),
		  document.getElementById('react')
);
