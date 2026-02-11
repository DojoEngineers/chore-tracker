import User from "../models/user.model.js"

export const getTestPush = async (id, title, pushBody, data) => {
    console.log("🔵 Push controller... user id:", id)
    
    try {
        const user = await User.findById(id).select('-password')
        
        if (!user) {
            console.log("❌ User not found")
            return { success: false, error: 'User not found' }
        }
        
        console.log("🔵 User notifications enabled:", user.notifications)
        console.log("🔵 User push tokens:", user.pushTokens)
        
        if (user.notifications === false) {
            console.log("⚠️ Not sending push. User has push turned off.")
            return { success: true, message: 'Notifications disabled by user' }
        }
        
        if (!user.pushTokens || user.pushTokens.length === 0) {
            console.log("⚠️ No push tokens found for user")
            return { success: false, error: 'No push tokens registered' }
        }
        
        const results = []
        const invalidTokens = []
        
        // Send to each token
        for (const token of user.pushTokens) {
            console.log("🔵 Sending to token:", token)
            
            const message = {
                to: token,
                sound: 'default',
                title,
                body: pushBody,
                data,
                channelId: 'default',
                priority: 'high',
            }
            
            try {
                const response = await fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Accept-encoding': 'gzip, deflate',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message),
                })
                
                const result = await response.json()
                console.log("🔵 Response for token:", token, result)
                
                if (response.ok && result.data?.status === 'ok') {
                    console.log('✅ Notification sent successfully to:', token)
                    results.push({ token, success: true })
                } else {
                    console.error('❌ Failed to send to token:', token, result)
                    results.push({ token, success: false, error: result })
                    
                    // Check if token is invalid and should be removed
                    const errorType = result.data?.details?.error
                    if (errorType === 'DeviceNotRegistered' || 
                        errorType === 'InvalidCredentials') {
                        console.log('🗑️ Marking token for removal:', token)
                        invalidTokens.push(token)
                    }
                }
            } catch (error) {
                console.error('❌ Error sending to token:', token, error.message)
                results.push({ token, success: false, error: error.message })
            }
        }
        
        // Remove invalid tokens from database
        if (invalidTokens.length > 0) {
            console.log('🗑️ Removing invalid tokens:', invalidTokens)
            await User.findByIdAndUpdate(id, {
                $pull: { pushTokens: { $in: invalidTokens } }
            })
        }
        
        // Check if at least one notification was sent successfully
        const successCount = results.filter(r => r.success).length
        console.log(`📊 Sent ${successCount}/${user.pushTokens.length} notifications successfully`)
        
        return {
            success: successCount > 0,
            totalTokens: user.pushTokens.length,
            successCount,
            failedCount: results.length - successCount,
            invalidTokensRemoved: invalidTokens.length,
            results
        }
        
    } catch (error) {
        console.error('❌ Error in push controller:', error.message)
        return { success: false, error: error.message }
    }
}