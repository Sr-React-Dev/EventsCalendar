function parseEvents(events) {
	let itemDateMap = [];

	events.map((event) => {
		let startDate = new Date(event.start.dateTime);
		let endDate = new Date(event.end.dateTime);
		const item = {
			id: event.id,
			title: event.summary,
			allDay: false,
			start: startDate.toLocaleString(),
			end: endDate.toLocaleString(),
			description: event.description,
			location: event.location
		};
		itemDateMap = [ item, ...itemDateMap ];
	});
	return itemDateMap;
}
function convertDateFormat(str) {
	let date = new Date(str);
	return date.toISOString().split('.')[0] + '-' + date.toISOString().split('.')[0].substr(14, 5);
}
function make2digit(arg) {
	if (arg < 10) return '0' + arg;
	else return arg;
}
function convertStringFormat(arg) {
	console.log('arg', arg);
	let date = new Date(arg);

	return `${date.getFullYear()}/${make2digit(date.getMonth() + 1)}/${make2digit(date.getDate())} ${make2digit(
		date.getHours()
	)}:${make2digit(date.getMinutes())}`;
}
export { parseEvents, convertDateFormat, convertStringFormat };
