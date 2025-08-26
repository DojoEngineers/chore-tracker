
// Utility functions for sending different types of notifications
export const NotificationService = {
  // Send chore reminder notification
  sendChoreReminder: async (token, choreName, dueDate) => {
    const message = {
      to: token,
      sound: 'default',
      title: '📋 Chore Reminder',
      body: `Don't forget: ${choreName} is due ${dueDate}`,
      data: { 
        type: 'chore_reminder',
        screen: 'ChoreList',
        choreName 
      },
    };

    return await sendNotification(message);
  },

  // Send chore completion notification
  sendChoreCompleted: async (token, choreName, workerName) => {
    const message = {
      to: token,
      sound: 'default',
      title: '✅ Chore Completed!',
      body: `${workerName} completed: ${choreName}`,
      data: { 
        type: 'chore_completed',
        screen: 'ChoreList',
        choreName 
      },
    };

    return await sendNotification(message);
  },

  // Send new chore assigned notification
  sendChoreAssigned: async (token, choreName, assignedBy) => {
    const message = {
      to: token,
      sound: 'default',
      title: '🎯 New Chore Assigned',
      body: `${assignedBy} assigned you: ${choreName}`,
      data: { 
        type: 'chore_assigned',
        screen: 'ChoreDetail',
        choreName 
      },
    };

    return await sendNotification(message);
  },

  // Send custom notification
  sendCustom: async (token, title, body, data = {}) => {
    const message = {
      to: token,
      sound: 'default',
      title,
      body,
      data,
    };

    return await sendNotification(message);
  },
};

// Helper function to send notification via Expo's API
const sendNotification = async (message) => {
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
    return { success: false, error };
  }
};