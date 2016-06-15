import { Component } from 'react';

/**
 * This class is designed to solve issue #16
 */
export default class TicketButton extends Component {

	render() {
		return (
			<a {...this.props}>
				Get Your Ticket
			</a>
		);
	}

}
