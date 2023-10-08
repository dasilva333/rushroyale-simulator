// // Redux Store 
// import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './reducers';

// const store = configureStore({
//     reducer: rootReducer
// });

// export default store;

import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import { empowermentMiddleware } from './empowermentMiddleware';

const store = createStore(
  rootReducer,
  applyMiddleware(empowermentMiddleware)
);

export default store;
