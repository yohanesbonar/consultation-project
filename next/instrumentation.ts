/**
 * Registers OpenTelemetry instrumentation based on the runtime environment.
 *
 * - If running in Node.js, it imports and initializes the Node.js instrumentation.
 */

export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		await import('./instrumentation.node');
	}
}
