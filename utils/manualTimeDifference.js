module.exports.time_difference = (timein12) => {
    let [times, ampm] = timein12.split(" ");
    let splitedTime = times.split(":");
    let totalTimes = 0;
    if (ampm = 'AM') {
        totalTimes = (Number(splitedTime[0]) * 60) + Number(splitedTime[1]);
    } else {
        totalTimes = 720 + (Number(splitedTime[0]) * 60) + Number(splitedTime[1]);
    }


    // if (totalTimes >= 60) {
    //   let hour = totalTimes / 60;
    //   let minutes = totalTimes % 60;
    //   return `${hour} h ${minutes} m`
    // } else {
    //   return `${totalTimes} m`
    // }

    return totalTimes;
}