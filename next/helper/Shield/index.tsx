/* eslint-disable react/prop-types */
// import { LOCALSTORAGE, setStringifyLocalStorage } from 'helper/LocalStorage';
import { LOCALSTORAGE, setStringifyLocalStorage } from 'helper/LocalStorage';
import { addLog } from 'helper/Network';
import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	shieldStart,
	shieldSuccess,
	shieldError,
	shieldTimeout,
} from '../../redux/actions/generalAction';

// Type definitions for better type safety
interface ShieldResult {
	result?: {
		device_intelligence?: {
			shield_id?: string;
			device_score?: number;
		};
		version?: string;
	};
}

interface ShieldDeviceData {
	id: string;
	score?: number;
	ver?: string;
	created_at: number;
}

interface ShieldClientProps {
	onGetId?: (id: string) => void;
	siteId?: string;
	enabled?: boolean;
}

// Global type declaration for the Shield function
declare global {
	interface Window {
		getDeviceResult?: () => Promise<ShieldResult>;
	}
}

const SHIELD_TIMEOUT = 3000; // 3 seconds timeout
const SHIELD_SCRIPT_URL = 'https://d1cr9zxt7u0sgu.cloudfront.net/shdfp.js';
export const SHIELD_ERROR_ID = 'SHIELD_ERROR';
const SHIELD_STATE_KEY = 'SHIELD_REDUX_STATE';

// Helper functions to persist Shield state
export const getShieldStateFromStorage = () => {
	try {
		const stored = sessionStorage.getItem(SHIELD_STATE_KEY);
		return stored ? JSON.parse(stored) : null;
	} catch (error) {
		console.debug('Error reading Shield state from storage:', error);
		return null;
	}
};

const setShieldStateToStorage = (state: any) => {
	try {
		sessionStorage.setItem(SHIELD_STATE_KEY, JSON.stringify(state));
	} catch (error) {
		console.debug('Error writing Shield state to storage:', error);
	}
};

const ShieldClient: React.FC<ShieldClientProps> = ({
	onGetId,
	siteId = 'a15f04e8925eed6aafcf059b183d953186e19fde',
	enabled = true,
}) => {
	const dispatch = useDispatch();
	const deviceResult = useSelector((state: any) => state.general.deviceResult);

	// Refs to manage timeouts and prevent memory leaks
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const isProcessingRef = useRef(false);
	const startTimeRef = useRef<number>(0);
	const hasTimedOutRef = useRef(false);

	console.log('Redux deviceResult:', deviceResult);

	// Cleanup function to clear timeouts
	const clearTimeoutRef = useCallback(() => {
		if (timeoutRef.current) {
			console.debug('Clearing timeout:', timeoutRef.current);
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	// Function to handle timeout
	const handleTimeout = useCallback(() => {
		// Check both Redux state and persisted state
		const persistedState = getShieldStateFromStorage();
		const isActuallyLoading = deviceResult.loading || (persistedState && persistedState.loading);

		if (!isActuallyLoading) return; // Don't timeout if already completed

		const elapsed = Date.now() - startTimeRef.current;
		console.debug(
			'Shield timeout triggered after',
			elapsed,
			'ms (expected:',
			SHIELD_TIMEOUT,
			'ms)',
		);

		// Set timeout flag
		hasTimedOutRef.current = true;

		clearTimeoutRef();
		dispatch(shieldTimeout());

		// Persist state to sessionStorage
		setShieldStateToStorage({
			loading: false,
			error: true,
			result: SHIELD_ERROR_ID,
			errorMessage: 'Shield operation timed out',
		});

		// Log timeout
		addLog({ shield_error: 'Shield operation timed out' });
		console.warn('Shield timeout: Operation took longer than', SHIELD_TIMEOUT, 'ms');

		// Only call onGetId if this is a fresh timeout (not from persisted state)
		// Check if we're in the middle of an active operation
		if (startTimeRef.current > 0 && elapsed > 0) {
			console.debug('Fresh timeout - calling onGetId with SHIELD_ERROR');
			if (onGetId) {
				onGetId(SHIELD_ERROR_ID);
			}
		} else {
			console.debug('Persisted timeout - not calling onGetId');
		}
	}, [clearTimeoutRef, dispatch, onGetId, deviceResult.loading]);

	// Function to get Shield ID with proper error handling
	const getShieldId = useCallback(async (): Promise<string> => {
		// Check if already timed out
		if (hasTimedOutRef.current) {
			console.debug('Operation cancelled - timeout flag is set');
			return SHIELD_ERROR_ID;
		}

		// Check both Redux state and persisted state
		const persistedState = getShieldStateFromStorage();
		const isActuallyLoading = deviceResult.loading || (persistedState && persistedState.loading);

		if (!window.getDeviceResult || isProcessingRef.current || !isActuallyLoading) {
			return deviceResult.result || SHIELD_ERROR_ID;
		}

		const operationStartTime = Date.now();
		const totalElapsed = operationStartTime - startTimeRef.current;
		console.debug('Starting Shield operation after', totalElapsed, 'ms');

		isProcessingRef.current = true;

		try {
			// Check if already timed out before starting the operation
			const timeoutCheckState = getShieldStateFromStorage();
			const hasTimedOut =
				timeoutCheckState &&
				timeoutCheckState.result === SHIELD_ERROR_ID &&
				timeoutCheckState.errorMessage === 'Shield operation timed out';
			if (hasTimedOut) {
				console.debug('Operation cancelled - timeout already occurred');
				return SHIELD_ERROR_ID;
			}

			// Execute Shield operation
			const result = await window.getDeviceResult();

			// Check if already timed out (check both states)
			const currentPersistedState = getShieldStateFromStorage();
			const isStillActuallyLoading =
				deviceResult.loading || (currentPersistedState && currentPersistedState.loading);
			if (!isStillActuallyLoading) {
				const operationElapsed = Date.now() - operationStartTime;
				console.debug(
					'Shield operation completed but already timed out after',
					operationElapsed,
					'ms',
				);
				return deviceResult.result || SHIELD_ERROR_ID;
			}

			// Validate Shield response structure
			if (!result || typeof result !== 'object') {
				throw new Error('Invalid Shield response: not an object');
			}

			if (!result.result || typeof result.result !== 'object') {
				throw new Error('Invalid Shield response: missing result object');
			}

			if (
				!result.result.device_intelligence ||
				typeof result.result.device_intelligence !== 'object'
			) {
				throw new Error('Invalid Shield response: missing device_intelligence object');
			}

			const deviceId = result.result.device_intelligence.shield_id;

			// Ensure device ID is not null or empty string
			if (!deviceId || typeof deviceId !== 'string' || deviceId.trim() === '') {
				throw new Error('Invalid Shield response: device_id is null or empty');
			}

			// Store device data in sessionStorage
			const deviceData: ShieldDeviceData = {
				id: deviceId,
				score: result.result.device_intelligence.device_score,
				ver: result.result.version,
				created_at: Date.now(),
			};

			await setStringifyLocalStorage(LOCALSTORAGE.DEVICE, deviceData);

			// Log successful operation
			addLog({
				shield_id: deviceData.id,
				shield_score: deviceData.score,
				shield_version: deviceData.ver,
			});

			const operationElapsed = Date.now() - operationStartTime;
			const totalElapsedFinal = Date.now() - startTimeRef.current;
			console.debug(
				'Shield operation completed successfully:',
				deviceData.id,
				'in',
				operationElapsed,
				'ms (total:',
				totalElapsedFinal,
				'ms)',
			);

			// Clear timeout since operation completed successfully
			clearTimeoutRef();

			// Update Redux state
			dispatch(shieldSuccess(deviceData.id));

			// Persist state to sessionStorage
			setShieldStateToStorage({
				loading: false,
				error: false,
				result: deviceData.id,
			});

			// Call callback with result
			if (onGetId) {
				onGetId(deviceData.id);
			}

			return deviceData.id;
		} catch (err) {
			// Check if already timed out (check both states)
			const currentPersistedState = getShieldStateFromStorage();
			const isStillActuallyLoading =
				deviceResult.loading || (currentPersistedState && currentPersistedState.loading);
			if (!isStillActuallyLoading) {
				const operationElapsed = Date.now() - operationStartTime;
				console.debug(
					'Shield operation failed but already timed out after',
					operationElapsed,
					'ms',
				);
				return deviceResult.result || SHIELD_ERROR_ID;
			}

			clearTimeoutRef();

			const errorMessage = err instanceof Error ? err.message : 'Unknown Shield error';

			// Update Redux state
			dispatch(shieldError(errorMessage));

			// Persist state to sessionStorage
			setShieldStateToStorage({
				loading: false,
				error: true,
				result: SHIELD_ERROR_ID,
				errorMessage,
			});

			// Log error
			addLog({ shield_error: errorMessage });

			const operationElapsed = Date.now() - operationStartTime;
			console.warn('Shield error after', operationElapsed, 'ms:', errorMessage);

			// Only call onGetId if this is a fresh error from getDeviceResult
			if (operationStartTime > 0 && operationElapsed > 0) {
				console.debug('Fresh error from getDeviceResult - calling onGetId with SHIELD_ERROR');
				if (onGetId) {
					onGetId(SHIELD_ERROR_ID);
				}
			} else {
				console.debug('Persisted error - not calling onGetId');
			}

			return SHIELD_ERROR_ID;
		} finally {
			isProcessingRef.current = false;
		}
	}, [clearTimeoutRef, dispatch, onGetId, deviceResult.loading, deviceResult.result]);

	// Start Shield operation when component mounts
	useEffect(() => {
		if (!enabled) return;

		console.debug('Shield useEffect triggered - deviceResult:', deviceResult);

		// Check if we have persisted state in sessionStorage
		const persistedState = getShieldStateFromStorage();
		if (persistedState) {
			console.debug('Found persisted Shield state:', persistedState);

			// If we have a successful result, use it for Redux state but don't call onGetId
			if (
				persistedState.result &&
				persistedState.result !== SHIELD_ERROR_ID &&
				!persistedState.error
			) {
				console.debug(
					'Using persisted successful result for Redux state:',
					persistedState.result,
				);
				dispatch(shieldSuccess(persistedState.result));
				// Don't call onGetId here - only call it when getDeviceResult() actually succeeds
				return;
			}

			// If we have an error result, use it for Redux state but don't call onGetId
			if (persistedState.result === SHIELD_ERROR_ID && persistedState.error) {
				console.debug('Using persisted error result for Redux state');
				dispatch(shieldError(persistedState.errorMessage || 'Shield operation failed'));
				// Don't call onGetId here - only call it when getDeviceResult() actually succeeds
				return;
			}

			// If we have a loading state, restore it to Redux
			if (persistedState.loading) {
				console.debug('Restoring persisted loading state to Redux');
				dispatch(shieldStart());
				return;
			}
		}

		// If Shield has already completed, don't start again
		if (deviceResult.result && deviceResult.result !== SHIELD_ERROR_ID) {
			console.debug(
				'Shield already completed successfully, using cached result:',
				deviceResult.result,
			);
			// Don't call onGetId here - only call it when getDeviceResult() actually succeeds
			return;
		}

		// If Shield has already failed, don't start again
		if (deviceResult.result === SHIELD_ERROR_ID && deviceResult.loading === false) {
			console.debug('Shield already failed, using cached error result');
			// Don't call onGetId here - only call it when getDeviceResult() actually succeeds
			return;
		}

		// If Shield is already loading, don't start again
		if (deviceResult.loading) {
			console.debug('Shield already loading, skipping...');
			return;
		}

		startTimeRef.current = Date.now();
		hasTimedOutRef.current = false; // Reset timeout flag
		console.debug('Shield component mounted, starting operation...');

		// Start Shield operation in Redux
		dispatch(shieldStart());

		// Persist loading state to sessionStorage
		setShieldStateToStorage({
			loading: true,
			error: false,
			result: null,
		});

		// Start timeout
		timeoutRef.current = setTimeout(() => {
			console.debug('Timeout callback triggered - about to call handleTimeout');
			handleTimeout();
		}, SHIELD_TIMEOUT);

		console.debug(
			'Shield timeout started:',
			SHIELD_TIMEOUT,
			'ms, timeoutRef:',
			timeoutRef.current,
		);

		// Cleanup on unmount
		return () => {
			console.debug('Shield component unmounting, cleaning up...');
			console.debug('Timeout ref before cleanup:', timeoutRef.current);
			// Don't clear timeout on unmount - let it persist and trigger
			// clearTimeoutRef();
		};
	}, [
		enabled,
		dispatch,
		onGetId,
		deviceResult.result,
		deviceResult.loading,
		handleTimeout,
		clearTimeoutRef,
	]);

	// Handle script load
	const handleScriptLoad = useCallback(async () => {
		const elapsed = Date.now() - startTimeRef.current;
		console.debug('Shield script loaded after', elapsed, 'ms, deviceResult:', deviceResult);

		// Check both Redux state and persisted state
		const persistedState = getShieldStateFromStorage();
		const isActuallyLoading = deviceResult.loading || (persistedState && persistedState.loading);

		// Check if already completed
		if (!isActuallyLoading) {
			console.debug('Script loaded but already completed');
			return;
		}

		console.debug('Waiting for script initialization...');
		// Wait a bit for the script to initialize
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Check if already completed after waiting
		const currentPersistedState = getShieldStateFromStorage();
		const isStillLoading =
			deviceResult.loading || (currentPersistedState && currentPersistedState.loading);
		if (!isStillLoading) {
			console.debug('Script initialized but already completed');
			return;
		}

		// Check if getDeviceResult is available
		if (!window.getDeviceResult) {
			console.debug('getDeviceResult not available yet, waiting...');
			// Wait a bit more for the function to be available
			await new Promise((resolve) => setTimeout(resolve, 500));

			if (!window.getDeviceResult) {
				console.debug('getDeviceResult still not available, this might be an error');
				const finalPersistedState = getShieldStateFromStorage();
				const isStillActuallyLoading =
					deviceResult.loading || (finalPersistedState && finalPersistedState.loading);
				if (isStillActuallyLoading) {
					clearTimeoutRef();
					dispatch(shieldError('Shield function not available'));
					setShieldStateToStorage({
						loading: false,
						error: true,
						result: SHIELD_ERROR_ID,
						errorMessage: 'Shield function not available',
					});
					// Only call onGetId if this is a fresh error
					if (startTimeRef.current > 0) {
						console.debug(
							'Fresh getDeviceResult not available error - calling onGetId with SHIELD_ERROR',
						);
						if (onGetId) {
							onGetId(SHIELD_ERROR_ID);
						}
					} else {
						console.debug(
							'Persisted getDeviceResult not available error - not calling onGetId',
						);
					}
				}
				return;
			}
		}

		console.debug('Starting Shield operation...');
		// Get Shield ID
		await getShieldId();
	}, [getShieldId, onGetId, clearTimeoutRef, dispatch, deviceResult.loading]);

	// Handle script error
	const handleScriptError = useCallback(() => {
		// Check both Redux state and persisted state
		const persistedState = getShieldStateFromStorage();
		const isActuallyLoading = deviceResult.loading || (persistedState && persistedState.loading);

		// Check if already completed
		if (!isActuallyLoading) return;

		dispatch(shieldError('Failed to load Shield script'));
		setShieldStateToStorage({
			loading: false,
			error: true,
			result: SHIELD_ERROR_ID,
			errorMessage: 'Failed to load Shield script',
		});

		// Only call onGetId if this is a fresh script error
		if (startTimeRef.current > 0) {
			console.debug('Fresh script error - calling onGetId with SHIELD_ERROR');
			if (onGetId) {
				onGetId(SHIELD_ERROR_ID);
			}
		} else {
			console.debug('Persisted script error - not calling onGetId');
		}
	}, [dispatch, onGetId, deviceResult.loading]);

	// Don't render if disabled
	if (!enabled) {
		return null;
	}

	return (
		<>
			<Script
				src={`${SHIELD_SCRIPT_URL}?SITE_ID=${siteId}&TYPE=JS&AUTO=0`}
				strategy="afterInteractive"
				onLoad={handleScriptLoad}
				onError={handleScriptError}
			/>
			<noscript>
				<iframe
					src={`https://ap-device.csftr.com/shield-fp/v1/api/web/noscript?site_id=${siteId}`}
					width="0"
					height="0"
					style={{ display: 'none' }}
					title="Shield fingerprinting"
				/>
			</noscript>
		</>
	);
};

export default ShieldClient;
