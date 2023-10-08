import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import { empowermentMiddleware } from './empowermentMiddleware';
import { likeNeighborsMiddleware } from './likeNeighborsMiddleware';
import { buffCalculationMiddleware } from './buffCalculationMiddleware';

const store = createStore(
  rootReducer,
  applyMiddleware(buffCalculationMiddleware, likeNeighborsMiddleware, empowermentMiddleware)
);


export default store;
