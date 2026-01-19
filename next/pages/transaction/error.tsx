import { TransactionErrorTemplate } from '@templates';
import usePartnerInfo from 'hooks/usePartnerInfo';

const TransactionError = () => {
	usePartnerInfo({ isByLocal: true });
	return <TransactionErrorTemplate />;
};
export default TransactionError;
