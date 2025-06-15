const Booking = require('../models/booking');
const Payment = require('../models/payment');

async function cleanupPendingBookings() {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        // Find all expired pending bookings
        const expiredBookings = await Booking.find({
            status: 'pending',
            createdAt: { $lte: oneHourAgo }
        }).select('_id payments');

        const expiredPayments = await Payment.find({
            status: 'pending',
            createdAt: { $lte: oneHourAgo }
        }).select('_id');

        const expiredBookingIds = expiredBookings.map(b => String(b._id));

        // Collect all payment IDs from those bookings
        const relatedPaymentIdsToDelete = expiredBookings.flatMap(b => b.payments);
        const paymentIdsToDelete = expiredPayments.flatMap(payment => String(payment._id));

        // Delete all payments that are either in that list OR have pending status
        await Payment.deleteMany({
            $or: [
                { _id: { $in: relatedPaymentIdsToDelete } },
                { status: 'pending' }
            ]
        });

        // Remove deleted payment IDs from any Booking (defensive clean)
        const bookingsWithDeletedPayments = await Booking.find({
            payments: { $in: expiredPayments }
        });

        for (const booking of bookingsWithDeletedPayments) {
            booking.set({
                ...booking,
                payments: booking.payments.filter((payment) => !paymentIdsToDelete.includes(String(payment)) && !relatedPaymentIdsToDelete.includes(String(payment)))
            })

            await booking.save()
        }

        if (expiredBookingIds.length === 0) {
            console.log('✅ No expired bookings to delete.');
            return;
        }

        // Delete the bookings themselves
        await Booking.deleteMany({ _id: { $in: expiredBookingIds } });
    } catch (err) {
        console.log(err)
    }
}

module.exports = cleanupPendingBookings;
