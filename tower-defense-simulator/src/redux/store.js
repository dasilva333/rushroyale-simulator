import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import { empowermentMiddleware } from './empowermentMiddleware';
import { likeNeighborsMiddleware } from './likeNeighborsMiddleware';

const store = createStore(
  rootReducer,
  applyMiddleware(likeNeighborsMiddleware, empowermentMiddleware)
);

export default store;
