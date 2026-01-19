import {
	SET_VOUCHER,
	SET_TRANSACTION_DETAIL,
	SET_VOUCHER_LIST,
	SET_VOUCHER_KEYWORD,
	SET_VOUCHER_SELECTED,
	SET_PRODUCT_TRANSACTION_DETAIL,
	SET_CART,
	SET_HISTORY,
	SET_VOUCHER_VALIDATOR,
} from '../actions/transactionAction';

const initialState = {
	voucher: {},
	voucherList: {
		result: { canUse: [], canotUse: [] },
		loading: false,
		error: false,
	},
	transactionDetail: {
		result: false,
		loading: false,
		error: false,
	},
	cart: {
		result: null,
		loading: false,
		error: false,
	},
	history: {
		result: null,
		type: null,
		loading: true,
		token: null,
		error: false,
	},
	productTransactionDetail: {
		result: false,
		loading: true,
		error: false,
	},
	keyword: '',
	voucherSelected: '',
	voucherValidator: {},
};

const transactionReducer = (
	state = initialState,
	action: {
		type: string;
		payload: any;
	},
) => {
	switch (action.type) {
		case SET_VOUCHER:
			return { ...state, voucher: action.payload };
		case SET_TRANSACTION_DETAIL:
			return { ...state, transactionDetail: action.payload };
		case SET_PRODUCT_TRANSACTION_DETAIL:
			return { ...state, productTransactionDetail: action.payload };
		case SET_VOUCHER_LIST:
			return { ...state, voucherList: action.payload };
		case SET_VOUCHER_KEYWORD:
			return { ...state, keyword: action.payload };
		case SET_VOUCHER_SELECTED:
			return { ...state, voucherSelected: action.payload };
		case SET_CART:
			return { ...state, cart: action.payload };
		case SET_HISTORY:
			return { ...state, history: action.payload };
		case SET_VOUCHER_VALIDATOR:
			return { ...state, voucherValidator: action.payload };
		default:
			return { ...state };
	}
};

export default transactionReducer;
