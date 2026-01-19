import snapConfig from 'config';
import { clarity } from 'react-microsoft-clarity';

export const clarityInit = () => {
	clarity.init(snapConfig.CLARITY_ID);
};

export const claritySetCustomTag = (key: string, value: string) => {
	if (clarity.hasStarted()) clarity.setTag(key, value);
};

export const clarityUpgrade = (reason: string) => {
	if (clarity.hasStarted()) clarity.upgrade(reason);
};
