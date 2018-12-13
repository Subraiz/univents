export const addUserAttended = (event, user) => {
  let eventData = event.eventData;
  let date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();

  let time = {
    hour: hour,
    minute: minute
  };

  user.time = time;

  eventData.usersAttended.push(user);
  eventData.currentAttendance++;
};

// Data functions
export const getSexData = event => {
  let eventData = event.eventData;
  let data = {};
  let sexData = {
    males: [],
    females: [],
    other: []
  };

  eventData.usersAttended.forEach(user => {
    if (user.sex.toLowerCase() == "female") {
      sexData.females.push(user);
    } else if (user.sex.toLowerCase() == "male") {
      sexData.males.push(user);
    } else {
      sexData.other.push(user);
    }
  });
  let total = eventData.currentAttendance + 0.0;

  let maleRatio = sexData.males.length / total;
  let femaleRatio = sexData.females.length / total;
  let otherRatio = sexData.other.length / total;

  data = [];

  let numbers = [
    { title: "Males", data: sexData.males.length },
    { title: "Females", data: sexData.females.length },
    { title: "Other", data: sexData.other }
  ];

  numbers.forEach(number => {
    if (number.data > 0) {
      data.push({ x: number.title, y: number.data });
    }
  });

  return data;
};

export const getYearData = event => {
  let eventData = event.eventData;
  let yearData = {
    freshman: [],
    sophomore: [],
    junior: [],
    senior: []
  };

  eventData.usersAttended.forEach(user => {
    console.log(user);
    if (user.year.toLowerCase() == "freshman") {
      yearData.freshman.push(user);
    } else if (user.year.toLowerCase() == "sophomore") {
      yearData.sophomore.push(user);
    } else if (user.year.toLowerCase() == "junior") {
      yearData.junior.push(user);
    } else if (user.year.toLowerCase() == "senior") {
      yearData.junior.push(user);
    }
  });

  let total = eventData.currentAttendance + 0.0;
  let freshmanRatio = yearData.freshman.length / total;
  let sophomoreRatio = yearData.sophomore.length / total;
  let juniorRatio = yearData.junior.length / total;
  let seniorRatio = yearData.senior.length / total;

  let data = [];

  let numbers = [
    { title: "Freshmen", data: yearData.freshman.length },
    { title: "Sophomores", data: yearData.sophomore.length },
    { title: "Juniors", data: yearData.junior.length },
    { title: "Seniors", data: yearData.senior.length }
  ];

  numbers.forEach(number => {
    if (number.data > 0) {
      data.push({ x: number.title, y: number.data });
    }
  });

  return data;
};

export const getTimeData = event => {
  let timeInterval;
  let interval;

  let timeData = [];
  let eventData = event.eventData;

  let startTimeArray = event.eventTime.startTime.split(":");
  let endTimeArray = event.eventTime.endTime.split(":");

  let startHour = parseInt(startTimeArray[0], 10);
  let startMinute = parseInt(startTimeArray[1], 10) / 60.0;

  let endHour = parseInt(endTimeArray[0], 10);
  let endMinute = parseInt(endTimeArray[1], 10) / 60.0;

  let startTime = startHour + startMinute;
  let endTime = endHour + endMinute;

  let totalTimeInMinutes = (endTime - startTime) * 60;
  console.log(totalTimeInMinutes);

  if (startHour > endHour) {
    totalTimeInMinutes = [24 - [startTime - endTime]] * 60;
  }
  console.log(totalTimeInMinutes);

  if (totalTimeInMinutes < 60) {
    interval = [totalTimeInMinutes * 3] / 15;
    timeInterval = totalTimeInMinutes / interval;
  }

  if (totalTimeInMinutes % 60 == 0) {
    let hourConstant = totalTimeInMinutes / 60;
    interval = totalTimeInMinutes / [hourConstant * 10];
    timeInterval = totalTimeInMinutes / interval;
  } else {
    let hourConstant = Math.floor(totalTimeInMinutes / 60) - 1;
    interval = [totalTimeInMinutes / 15] - hourConstant * 4;
    timeInterval = totalTimeInMinutes / interval;
  }

  for (var i = 0; i <= interval; i++) {
    let rawTime = startTime + i * [timeInterval / 60];
    let stringTime = getTimeAsString(startTime, i, timeInterval);

    timeData[i] = { time: stringTime, earnings: 0 };
  }

  eventData.usersAttended.forEach(user => {
    let userHour = parseInt(user.time.hour);
    let userMinute = parseInt(user.time.minute) / 60;
    let userTime = userHour + userMinute;
    let elapsedTime = [userTime - startTime] * 60;
    let index = Math.floor(elapsedTime / timeInterval);
    console.log(index);
    if (index < timeData.length && index >= 0) {
      timeData[index].earnings = eventData.currentAttendance;
    }
  });

  console.log(timeData);

  return timeData;
};

function getTimeAsString(startTime, interval, timeInterval) {
  startTime = parseInt(startTime);
  let accurateTime = startTime + interval * [timeInterval / 60];
  let hour = Math.round([startTime + interval * [timeInterval / 60]] * 10) / 10;
  hour = Math.floor(hour);
  let decimal = accurateTime - Math.floor(accurateTime);
  let minute = Math.round([decimal] * 60);

  if (hour > 12) {
    hour = hour - 12;
  }

  if (hour == 0) {
    hour = 12;
  }

  if (minute < 10) {
    minute = `0${minute}`;
  }
  let time = `${hour}:${minute}`;
  return time;
}
