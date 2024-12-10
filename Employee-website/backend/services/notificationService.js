const User = require('../models/User');
const webpush = require('web-push');

class NotificationService {
    static async sendPushNotification(userId, title, body) {
        try {
            const user = await User.findById(userId);
            if (user && user.pushSubscription) {
                await webpush.sendNotification(
                    user.pushSubscription,
                    JSON.stringify({
                        title,
                        body,
                        icon: '/icon.png'
                    })
                );
            }
        } catch (error) {
            console.error('Push notification failed:', error);
        }
    }

    static async broadcastNotification(role, title, body) {
        try {
            const users = await User.find({ role });
            for (const user of users) {
                await this.sendPushNotification(user._id, title, body);
            }
        } catch (error) {
            console.error('Broadcast notification failed:', error);
        }
    }
}

module.exports = NotificationService;