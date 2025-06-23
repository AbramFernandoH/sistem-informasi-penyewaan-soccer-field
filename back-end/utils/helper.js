const { DateTime } = require('luxon');

const calculatePaymentAmount = (bookingDate, totalPrice) => {
    const today = DateTime.local().startOf('day');
    const orderDate = DateTime.fromISO(bookingDate).startOf('day');
    const diffInDays = orderDate.diff(today, 'days').days;

    return diffInDays >= 3 ? totalPrice / 2 : totalPrice
};

const formattedEmailDate = (isoString) => {
    const date = DateTime.fromFormat(new Date(isoString).toDateString(), 'ccc LLL dd yyyy', { zone: 'utc' });

    if (!date.isValid) return 'Invalid date';

    return date.setLocale('id').toFormat('cccc, dd LLLL yyyy');
}

const formatIndonesianDate = (dateString) => {
    const date = DateTime.fromFormat(new Date(dateString).toDateString(), 'ccc LLL dd yyyy', { zone: 'utc' });

    if (!date.isValid) return 'Invalid date';

    return date.setLocale('id').toFormat('cccc, dd LLLL yyyy');
}

const HELPER = { calculatePaymentAmount, formattedEmailDate, formatIndonesianDate }

module.exports = HELPER;
