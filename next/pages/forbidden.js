import React from 'react';
import { Wrapper } from '../components';
import { getProfile, loggedIn } from '../helper';
export default class Forbidden extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			login: 0,
			user: null,
		};
	}

	componentDidMount() {
		if (loggedIn()) {
			this.setState({
				login: 1,
				user: getProfile(),
			});
		}
	}

	render() {
		return (
			<Wrapper
				{...this.props}
				title="Forbidden"
				module="User"
				permission="read"
				header={true}
				footer={true}
			>
				<div className="tw-min-h-screen tw-p-16 tw-flex tw-items-center">
					<div className="tw-mx-auto tw-relative tw-px-4 tw-text-center">
						<h1>Oops!</h1>
						<h3 className="tw-text-lg tw-font-normal">
							Sorry...You cannot access this module
						</h3>
					</div>
				</div>
			</Wrapper>
		);
	}
}
