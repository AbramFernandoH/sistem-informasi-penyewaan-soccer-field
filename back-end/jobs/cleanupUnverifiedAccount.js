const User = require('../models/user');

async function cleanupUnverifiedAccount() {
    try {
        const now = Math.floor(Date.now() / 1000);

        const unverifiedUsers = await User.find({
            isVerified: false,
            emailVerificationExpires: { $lt: now }
        }).select('_id');

        const userIdsToDelete = unverifiedUsers.map(u => u._id);

        if (userIdsToDelete.length > 0) {
            await User.deleteMany({ _id: { $in: userIdsToDelete } });
            console.log(`🧼 Deleted ${userIdsToDelete.length} unverified user(s):`);
        } else {
            console.log('✅ No unverified users to delete.');
        }
    } catch (err) {
        console.log('❌ Error during unverified user cleanup:', err);
    }
}

module.exports = cleanupUnverifiedAccount;

