import React from 'react';
import PropTypes from 'prop-types';

import EventComponent from './EventComponent';

class EventList extends React.Component {
	componentDidMount() {}
	render() {
		const { classes, events, loadEvents } = this.props;

		return (
			<div>
				{events.map((event, i) => {
					return <EventComponent event={event} key={i} loadEvents={loadEvents} />;
				})}
			</div>
		);
	}
}

EventList.propTypes = {
	classes: PropTypes.object.isRequired
};

export default EventList;
