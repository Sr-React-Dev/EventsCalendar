import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import GoogleCalendarApi from '../helper/GoogleCalendarApi';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { Grid, TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputMask from 'react-input-mask';
import { convertStringFormat, convertDateFormat } from '../helper/Utilities';
function getModalStyle() {
	return {
		top: 'calc(50% - 200px)',
		left: 'calc(50% - 200px)'
	};
}
const styles = {
	root: {},
	card: {
		maxWidth: 400,
		margin: '10px auto'
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	title: {
		fontSize: 14
	},
	pos: {
		marginBottom: 12
	},
	paper: {
		position: 'absolute',
		width: '400px',
		backgroundColor: 'white',
		padding: '20px',
		outline: 'none'
	}
};
class EventComponent extends React.Component {
	state = {
		open: false,
		eventId: '',
		title: '',
		from: '',
		to: '',
		eventId: 0,
		description: ''
	};

	handleClose = () => {
		this.setState({ open: false });
	};
	handleEdit = (e) => {
		this.setState({ open: true });
	};

	handleRemove = (e) => {
		GoogleCalendarApi.deleteEvent(this.state.eventId, this.props.loadEvents);
	};
	handleChange = (e) => {
		let change = {};
		change[e.target.name] = e.target.value;
		this.setState(change);
	};
	updateEvent = (e) => {
		GoogleCalendarApi.updateEvent(
			this.state.eventId,
			this.state.title,
			convertDateFormat(this.state.from),
			convertDateFormat(this.state.to),
			this.state.description,
			this.props.loadEvents
		);
	};
	componentDidMount() {
		this.handleEdit = this.handleEdit.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.setState({
			eventId: this.props.event.id,
			title: this.props.event.title,
			from: convertStringFormat(this.props.event.start),
			to: convertStringFormat(this.props.event.end),
			description: this.props.event.description,
			location: this.props.event.location
		});
	}
	render() {
		const { classes, event } = this.props;
		return (
			<div>
				<Card
					style={event.location == 'eventsCalendar' ? { background: 'lightblue' } : {}}
					className={classes.card}
				>
					<CardHeader
						avatar={
							<Avatar aria-label="Recipe" className={classes.avatar}>
								{event.title[0]}
							</Avatar>
						}
						action={
							<div>
								<IconButton data-event-id={event.id} onClick={this.handleEdit}>
									<EditIcon />
								</IconButton>
								<IconButton data-event-id={event.id} onClick={this.handleRemove}>
									<DeleteIcon />
								</IconButton>
							</div>
						}
						title={event.title}
						subheader={event.start + ' - ' + event.end}
					/>
					<CardContent>
						<Typography className={classes.title} color="textSecondary" gutterBottom>
							{event.description}
						</Typography>
					</CardContent>
					<CardActions />
				</Card>
				<div>
					<Modal
						aria-labelledby="simple-modal-title"
						aria-describedby="simple-modal-description"
						open={this.state.open}
						onClose={this.handleClose}
					>
						<div style={getModalStyle()} className={classes.paper}>
							<Typography variant="h6" id="modal-title">
								Update Event
							</Typography>
							<Grid container spacing={24}>
								<FormControl margin="normal" required fullWidth>
									<TextField
										label="Title"
										name="title"
										value={this.state.title}
										onChange={this.handleChange.bind(this)}
									/>
								</FormControl>
								<Grid item xs={6}>
									<InputMask
										mask="9999/99/99 99:99"
										value={this.state.from}
										name="from"
										onChange={this.handleChange.bind(this)}
									>
										{(inputProps) => <TextField {...inputProps} label="Start Date" />}
									</InputMask>
								</Grid>
								<Grid item xs={6}>
									<InputMask
										mask="9999/99/99 99:99"
										name="to"
										value={this.state.to}
										onChange={this.handleChange.bind(this)}
									>
										{(inputProps) => <TextField {...inputProps} label="End Date" />}
									</InputMask>
								</Grid>
								<FormControl margin="normal" required fullWidth>
									<TextField
										label="Description"
										margin="normal"
										multiline="true"
										name="description"
										value={this.state.description}
										onChange={this.handleChange.bind(this)}
									/>
								</FormControl>
								<Button variant="outlined" color="primary" onClick={this.updateEvent}>
									UPDATE
								</Button>
							</Grid>
						</div>
					</Modal>
				</div>
			</div>
		);
	}
}
EventComponent.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EventComponent);
