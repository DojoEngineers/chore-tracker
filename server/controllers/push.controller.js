
export const getTestPush = async (token, title, body, data = {}) => {
    console.log("push controller...")
        if (!token) {
            return { success: false, error }
        }

        const message = {
            to: token,
            sound: 'default',
            title,
            body,
            data,
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
                return { success: true, result };
            } else {
                console.error('❌ Failed to send notification:', result);
                return { success: false, error: result };
            }
        } catch (error) {
            console.error('❌ Error sending notification:', error);
            Alert.alert('Error', 'Failed to send notification');
            return { success: false, error };
        }
    };