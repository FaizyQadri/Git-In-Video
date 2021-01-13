import React from 'react';
import {} from 'react-native';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import reducer from './store/reducer';
import Child from './child';
import Test from './test';

const rootReducer = combineReducers({
  videos: reducer,
});
const store = createStore(rootReducer);

const App = () => {
  return (
    <Provider store={store}>
      <Child />
    </Provider>
  );
};
export default App;
