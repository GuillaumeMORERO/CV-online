import { createStore, applyMiddleware, compose } from 'redux';


// Logique de stockage et de manipulation des données de l'application.
import reducer from './reducer';
import mw from './middleware';


// applyMiddleware branche les middlewares de l'application au bon endroit
// sur le trajet des actions qui sont dispatchées vers le store.
// middlewares est par conséquent un "store enhancer".
const middlewares = applyMiddleware(mw);

const withReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Création du store de l'application, avec son state privé.
const reactModelStore = createStore(
  reducer,
  withReduxDevTools(middlewares)
);

// Juste pour debugguer, ne pas laisser en production.
window.store = reactModelStore;

export default reactModelStore;
