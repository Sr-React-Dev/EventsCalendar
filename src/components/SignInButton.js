import React, { Component } from 'react';
import googleCalendarApi from '../helper/GoogleCalendarApi';

import Button from '@material-ui/core/Button';

const styles = {
	root: {
		display: 'contents'
	}
};
export class SignInButton extends Component {
	constructor(props) {
		super(props);
		this.handleItemClick = this.handleItemClick.bind(this);
	}

	handleItemClick(event, name) {
		if (name === 'sign-in') {
			googleCalendarApi.handleAuthClick();
		} else if (name === 'sign-out') {
			googleCalendarApi.handleSignoutClick();
		}
	}

	render() {
		return (
			<div style={styles.root}>
				{!this.props.signedIn ? (
					<Button variant="contained" color="primary" onClick={(e) => this.handleItemClick(e, 'sign-in')}>
						Sign In
					</Button>
				) : (
					<Button variant="contained" color="primary" onClick={(e) => this.handleItemClick(e, 'sign-out')}>
						Sign Out
					</Button>
				)}
			</div>
		);
	}
}
