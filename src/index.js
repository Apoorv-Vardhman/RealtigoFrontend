import React from 'react';
import ReactDOM from "react-dom/client";

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// project imports
import { store, persister } from './store';
import App from './App';
import config from './config';

// style + assets
import './assets/scss/style.scss';

//-----------------------|| REACT DOM RENDER  ||-----------------------//
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
            <BrowserRouter basename={config.basename}>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>
);
