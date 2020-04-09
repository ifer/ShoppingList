import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter} from 'react-router-dom';
import App from './components/App';
import './styles/app.css';
import './styles/img/favicon.ico';

render(
		 (<BrowserRouter >
       		<App />
		  </BrowserRouter>),
		  document.getElementById('react')
);
