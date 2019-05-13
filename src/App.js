import React, { Component } from 'react';
import './App.css';

import { SignInButton } from './components/SignInButton';
import GoogleCalendarApi from './helper/GoogleCalendarApi';
import { parseEvents } from './helper/Utilities';
import AddEventModal from './components/AddEventModal';
import EventList from './components/EventList';

const style = {
	navbar: {
		padding: '10px 0'
	}
};
class App extends Component {
	constructor(props) {
		super(props);
		this.handleSignin = this.handleSignin.bind(this);
		this.startDate = new Date();
		this.endDate = new Date(this.startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

		this.state = {
			signedIn: false,
			startDate: this.startDate,
			endDate: this.endDate,
			events: [],
			isAddEventModalOpen: false
		};

		this.signedInStateChanged = this.signedInStateChanged.bind(this);
		this.addEvent = this.addEvent.bind(this);
		this.loadEvents = this.loadEvents.bind(this);
		GoogleCalendarApi.onLoad(() => {
			this.signedInStateChanged(GoogleCalendarApi.sign);
			GoogleCalendarApi.listenSign(this.signedInStateChanged);
		});
	}
	loadEvents() {
		GoogleCalendarApi.listUpcomingEvents(this.state.startDate, this.state.endDate).then((events) => {
			let items = parseEvents(events.items.slice());
			console.log(items);
			this.setState({
				events: items
			});
		});
	}
	addEvent() {
		this.setState({
			isAddEventModalOpen: true
		});
	}
	signedInStateChanged(state) {
		this.setState({
			signedIn: state
		});
		if (this.state.signedIn) {
			this.loadEvents();
		}
	}
	componentDidMount() {}

	componentWillUnmount() {}

	responseGoogle(response) {
		console.log(response);
	}
	handleSignin() {}
	render() {
		return (
			<div className="App">
				<div style={style.navbar}>
					<SignInButton signedIn={this.state.signedIn} signedInStateChanged={this.signedInStateChanged} />
					<AddEventModal loadEvents={this.loadEvents} buttonLabel="Add Event" />
				</div>

				<EventList loadEvents={this.loadEvents} events={this.state.events} />
			</div>
		);
	}
}

export default App;
