import Document, { Html, Head, Main, NextScript } from 'next/document';
export default class MyDocument extends Document {
	render() {
		return (
			<Html dir="ltr" lang="id">
				<Head></Head>
				<body className="tw-overscroll-y-none">
					<Main />
					<NextScript />
					{/* <script
						type="text/javascript"
						src="https://unpkg.com/axios/dist/axios.min.js"
						async=""
					></script> */}
					<script
						type="text/javascript"
						src="/assets/plugins/axios@1.7.7/dist/axios.min.js"
					></script>
					<script type="text/javascript" src="/assets/js/vendor.min.js"></script>
					<script type="text/javascript" src="/assets/js/app.min.js"></script>
				</body>
			</Html>
		);
	}
}
