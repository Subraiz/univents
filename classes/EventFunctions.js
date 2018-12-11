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

  let data = {
    male: maleRatio,
    female: femaleRatio,
    other: otherRatio
  };
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

  let data = {
    freshman: freshmanRatio,
    sophomore: sophomoreRatio,
    junior: juniorRatio,
    senior: seniorRatio
  };
  return data;
};
