const { DateTime } = require('luxon');

const calculatePaymentAmount = (bookingDate, totalPrice) => {
    const today = DateTime.local().startOf('day');
    const orderDate = DateTime.fromISO(bookingDate).startOf('day');
    const diffInDays = orderDate.diff(today, 'days').days;

    return diffInDays >= 3 ? totalPrice / 2 : totalPrice
};

const HELPER = { calculatePaymentAmount }

module.exports = HELPER;
