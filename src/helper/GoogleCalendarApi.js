import { config } from '../config';
import moment from 'moment';
class GoogleCalendarApp {
	constructor() {
		this.sign = false;
		this.gapi = null;
		this.onLoadCallback = null;
		this.calendar = 'primary';
		this.updateSigninStatus = this.updateSigninStatus.bind(this);
		this.initClient = this.initClient.bind(this);
		this.handleSignoutClick = this.handleSignoutClick.bind(this);
		this.handleAuthClick = this.handleAuthClick.bind(this);
		this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
		this.listenSign = this.listenSign.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.handleClientLoad();
	}
	updateSigninStatus(isSignedIn) {
		this.sign = isSignedIn;
	}
	initClient() {
		this.gapi = window['gapi'];
		const that = this;
		this.gapi.client.init(config).then(() => {
			that.gapi.auth2.getAuthInstance().isSignedIn.listen(that.updateSigninStatus);
			that.updateSigninStatus(that.gapi.auth2.getAuthInstance().isSignedIn.get());
			if (that.onLoadCallback) {
				that.onLoadCallback();
			}
		});
	}
	handleClientLoad() {
		const script = document.createElement('script');
		script.src = 'https://apis.google.com/js/api.js';
		document.body.appendChild(script);
		const that = this;
		script.onload = () => {
			window['gapi'].load('client:auth2', that.initClient);
		};
	}
	handleAuthClick() {
		if (this.gapi) {
			this.gapi.auth2.getAuthInstance().signIn();
		} else {
			console.log('Error: this.gapi not loaded');
		}
	}
	listenSign(callback) {
		if (this.gapi) {
			return this.gapi.auth2.getAuthInstance().isSignedIn.listen(callback);
		} else {
			console.log('Error: this.gapi not loaded');
		}
	}
	onLoad(callback) {
		if (this.gapi) {
			callback();
		} else {
			this.onLoadCallback = callback;
		}
	}
	handleSignoutClick() {
		if (this.gapi) {
			this.gapi.auth2.getAuthInstance().signOut();
		} else {
			console.log('Error: this.gapi not loaded');
		}
	}
	listUpcomingEvents(start, end) {
		if (this.gapi) {
			return this.gapi.client.calendar.events
				.list({
					calendarId: 'primary',
					timeMin: start.toISOString(),
					timeMax: end.toISOString(),
					singleEvents: true,
					orderBy: 'startTime'
				})
				.then((response) => {
					return response.result;
				});
		} else {
			console.log('Error: this.gapi not loaded');
			return false;
		}
	}
	insertEvent(title, start, end, description, loadEvent) {
		var event = {
			summary: title,
			location: 'eventsCalendar',
			description: description,
			start: {
				dateTime: start,
				timeZone: 'America/Los_Angeles'
			},
			end: {
				dateTime: end,
				timeZone: 'America/Los_Angeles'
			},
			recurrence: [ 'RRULE:FREQ=DAILY;COUNT=1' ],
			attendees: [ '' ],
			reminders: {
				useDefault: false,
				overrides: []
			}
		};
		console.log(event);
		var request = this.gapi.client.calendar.events.insert({
			calendarId: 'primary',
			resource: event
		});

		request.execute(function(event) {
			console.log('Event created: ' + event.htmlLink);
			loadEvent();
		});
	}
	updateEvent(id, title, start, end, description, loadEvent) {
		this.gapi.client.calendar.events
			.get({
				calendarId: 'primary',
				eventId: id
			})
			.then((event) => {
				console.log(id);
				console.log(event.result);
				event.result.summary = title;
				event.result.start.dateTime = start;
				event.result.end.dateTime = end;
				event.result.description = description;
				var request = this.gapi.client.calendar.events.update({
					calendarId: 'primary',
					eventId: id,
					resource: event.result
				});

				request.execute(function(event) {
					console.log('Event Updated: ' + event.htmlLink);
					loadEvent();
				});
			});
	}
	deleteEvent(id, loadEvent) {
		var request = this.gapi.client.calendar.events.delete({
			calendarId: 'primary',
			eventId: id
		});

		request.execute(function(event) {
			console.log('Event Delete: ' + event.htmlLink);
			loadEvent();
		});
	}
}
const GoogleCalendarApi = new GoogleCalendarApp();
export default GoogleCalendarApi;
