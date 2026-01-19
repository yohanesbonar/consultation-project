const snapConfig = {
	BASE_URL: process.env.NEXT_PUBLIC_NEXT_BASE_URL,
	BASE_API_URL: process.env.NEXT_PUBLIC_NEXT_BASE_API_URL,
	TIMEOUT: process.env.NEXT_PUBLIC_NEXT_TIMEOUT,
	WS_URL: process.env.NEXT_PUBLIC_WS_URL,
	LATCH: process.env.NEXT_PUBLIC_SNAP_KEY,
	CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID,
	CONSUL_API: process.env.NEXT_PUBLIC_CONSUL_API_BASE_URL,
};

module.exports = snapConfig;
