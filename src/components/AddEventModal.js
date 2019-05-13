import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import GoogleCalendarApi from '../helper/GoogleCalendarApi';
import { Grid, TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputMask from 'react-input-mask';
import { convertDateFormat } from '../helper/Utilities';
function getModalStyle() {
	return {
		top: 'calc(50% - 200px)',
		left: 'calc(50% - 200px)'
	};
}

const styles = (theme) => ({
	root: {
		display: 'contents'
	},
	paper: {
		position: 'absolute',
		width: '400px',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 3,
		outline: 'none'
	},
	signin: {
		marginLeft: '100px'
	}
});

class AddEventModal extends React.Component {
	state = {
		open: false,
		title: '',
		from: '',
		to: '',
		description: ''
	};

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};
	addEvent = () => {
		GoogleCalendarApi.insertEvent(
			this.state.title,
			convertDateFormat(this.state.from),
			convertDateFormat(this.state.to),
			this.state.description,
			this.props.loadEvents
		);
	};
	handleChange = (e) => {
		let change = {};
		change[e.target.name] = e.target.value;
		this.setState(change);
	};
	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<Button color="secondary" variant="contained" className={classes.signin} onClick={this.handleOpen}>
					+ NEW
				</Button>
				<Modal
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={this.state.open}
					onClose={this.handleClose}
				>
					<div style={getModalStyle()} className={classes.paper}>
						<Typography variant="h6" id="modal-title">
							Add New Event
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
							<Button variant="outlined" color="primary" onClick={this.addEvent}>
								SAVE
							</Button>
						</Grid>
					</div>
				</Modal>
			</div>
		);
	}
}

AddEventModal.propTypes = {
	classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
const AddEventModalWrapped = withStyles(styles)(AddEventModal);

export default AddEventModalWrapped;
