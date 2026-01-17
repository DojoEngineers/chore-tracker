import User from "../models/user.model.js"

export const getTestPush = async (id, token, title, pushBody, data) => {
    console.log("push controller...id:", id)
    if (!token) {
        console.log("no token provided")
        return { success: false }
    }
    console.log("token title body", token, title, pushBody)
    const user = await User.findById(id).select(`-password`)
    console.log("user push:", user.notifications, user.pushTokens)

    if (user.notifications == false) {
        console.log("Not sending push. User has push turned off.")
        return { success: true };
    }

    const message = {
        to: token,
        sound: 'default',
        title,
        body: pushBody,
        data,
        channelId: 'default', // Add this for Android
        priority: 'high',      // Add this
    };

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ Notification sent successfully:', result);
            return { success: true };
        } else {
            console.error('❌ Failed to send notification:', result);
            return { success: false, error: result };
        }
    } catch (error) {
        console.error('❌ Error sending notification:', error.message);
        return { success: false, error: error.message };
    }
};
