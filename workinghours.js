/*
# Objective:
write a function to find expiry datetime. expiry datetime is 3 working hours from "now".
the working hours is defined in "schedule" input parameter.
You can write the function in java or javascript programming language.

# input parameters:
now: datetime, current datetime. e.g: '2019-10-11T08:13:07+0800'
schedule: an arraylist of map object. which specified the day open or close and also the start and end of working hours
[
	{"open": false, "open_at": "", close_at: ""}, // sunday
	{"open": true, "open_at": "09:00", close_at: "18:00"}, // monday
	{"open": true, "open_at": "09:00", close_at: "18:00"},
	{"open": true, "open_at": "09:00", close_at: "18:00"},
	{"open": true, "open_at": "09:00", close_at: "18:00"},
	{"open": true, "open_at": "09:00", close_at: "17:00"},
	{"open": false, "open_at": "", close_at: ""},
]

# example:
now is friday 4pm. whith the above schedule, the expiry date should be next monday 11 am. because on friday office close
at 5pm and office is closed on weekend.

output: datetime, 3 working hour from input date ("now"), which is 11 am of next monday
*/

var schedule = [
	{ "open": false, "open_at": "", "close_at": "" }, // sunday
	{ "open": true, "open_at": "09:00", "close_at": "18:00" }, // monday
	{ "open": true, "open_at": "09:00", "close_at": "18:00" },
	{ "open": true, "open_at": "09:00", "close_at": "18:00" },
	{ "open": true, "open_at": "09:00", "close_at": "18:00" },
	{ "open": true, "open_at": "09:00", "close_at": "17:00" },
	{ "open": false, "open_at": "", "close_at": "" },
];


// For Normal course

var nextDaySchedule = [];
nextDaySchedule[0] = 1;
nextDaySchedule[1] = 2;
nextDaySchedule[2] = 3;
nextDaySchedule[3] = 4;
nextDaySchedule[4] = 5;
nextDaySchedule[5] = 1;
nextDaySchedule[6] = 1;

function find(now, schedule) {


	if(schedule.length <= 0)
	{
		throw "Work Schedule is empty";
	}

	if(!now || now == null || now == undefined || now === "")
	{
		throw "Current date is empty";
	}

	var resultdate;
	var expiryThresholdMins = (3 * 60);
	day = now.getDay();
	scheduleDetails = schedule[day];

	if(scheduleDetails.open === false)
	{
		throw "Cannot Process for Holidays";
	}

	if(scheduleDetails.open_at >= scheduleDetails.close_at)
	{
		throw "Office Open time should be less than closing time";
	}

	// Validate whether the request is made during working hours
	var scheduledTimeOpen = scheduleDetails.open_at.split(':');
	var scheduledTimeClose = scheduleDetails.close_at.split(':');;
	var currHours = now.getHours();

	if(currHours < scheduledTimeOpen[0] || currHours > scheduledTimeClose[0])
	{
		throw "Request time should be within office hours";
	}

	time = now.getTime();

	console.log("Current Local Datetime:", now.toLocaleString());

	// Parse closing Time
	var closingTime = [];
	var closingHours = "00";
	var closingMins = "00";
	var closingSecs = "00"
	var date2 = new Date();

	if(scheduleDetails && scheduleDetails.close_at && scheduleDetails.close_at !== "")
	{
		closingTime = scheduleDetails.close_at.split(':');

	}
	if(closingTime.length > 0)
	{
		closingHours = closingTime[0];
	    closingMins = closingTime[1];
		if (closingTime.length > 2) {
			closingSecs = closingTime[2];
		}
		date2.setHours(closingHours);
		date2.setMinutes(closingMins);
		date2.setSeconds(closingSecs);
	}
	// Calculate Time Difference

	var diff = date2.getTime() - now.getTime();
	var hours = Math.floor(diff / (1000 * 60 * 60));
	diff -= hours * (1000 * 60 * 60);
	var mins = Math.floor(diff / (1000 * 60));
	diff -= mins * (1000 * 60);

	var currMins = +(hours * 60) + +(mins); // Calclulate time left for the day

	// Check whether expiry time span is for the same day or succesive day
	if (currMins >= expiryThresholdMins) {
		resultdate = new Date(now.getTime() + (3 * 60 * 60 * 1000));
	} else {
		// Check for next schedule
		var minsDiff = expiryThresholdMins - currMins;
		var next = schedule[nextDaySchedule[day]];

		var nextDateOffset = 0;
		if (day === 5 || day === 6) {
			nextDateOffset = (7 - day) + 1;
		} else {
			nextDateOffset = day + 1;
		}

		// Verify Schedule whether holiday or not
		if(next.open ===  false)
		{
			var loopCount = nextDaySchedule[day] + 1;
			for(var i = loopCount; i <= schedule.length; i++)
			{
				nextDateOffset++;
				if(schedule[i].open === true && i !== 5 && i !== 6)
				{
					next = schedule[i];
					break;
				}
			}
		}
		openingTime = next.open_at.split(':')
		var nxtHours = openingTime[0];
		var nxtMins = openingTime[1];

		var totalnxtMins = +(nxtHours * 60) + +(nxtMins);

		var expiryMins = +totalnxtMins + +minsDiff;

		var resultHours = Math.floor(expiryMins / 60);
		var resultMinutes = expiryMins % 60;

		var date3 = new Date();
		date3.setDate(now.getDate() + nextDateOffset)
		date3.setHours(resultHours);
		date3.setMinutes(resultMinutes);
		resultdate = date3;
	}

	return resultdate;
}
//date = new Date('2020-04-10T07:26:55.657Z');
var value = find(new Date(), schedule);
console.log("Local Time of Expiration:", value.toLocaleString());