function day_interval(last_checked_date) {

    var actual_date = new Date()

    if (last_checked_date.getFullYear() == actual_date.getFullYear() && last_checked_date.getMonth() == actual_date.getMonth() && last_checked_date.getDate() == actual_date.getDate()) {
        return false; // everything is same so still same date or same day
    }
    else {
        return true; // different date or day
    }
}

module.exports = { day_interval }