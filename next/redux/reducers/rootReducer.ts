import { combineReducers } from 'redux';
import generalReducer from './generalReducer';
import consultationReducer from './consultationReducer';
import authReducer from './authReducer';
import transactionReducer from './transactionReducer';
import seamlessReducer from './seamlessPrescriptionReducer';
import ratingReducer from './ratingReducer';

const rootReducer = combineReducers({
	general: generalReducer,
	consultation: consultationReducer,
	verifyData: authReducer,
	transaction: transactionReducer,
	seamless: seamlessReducer,
	rating: ratingReducer,
});

export default rootReducer;
