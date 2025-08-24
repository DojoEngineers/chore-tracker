import { useEffect, useRef } from 'react'
import { TouchableWithoutFeedback, Animated, Platform} from 'react-native'
import { useLogin } from '../context/UserContext'

export const NotificationsSwitch = () => {
    const { notifications, toggleNotifications } = useLogin();
    const anim = useRef(new Animated.Value(notifications ? 1 : 0)).current;

    // Animate whenever notifications state changes
    useEffect(() => {
        Animated.timing(anim, {
        toValue: notifications ? 1 : 0,
        duration: Platform.OS === 'ios' ? 200 : 150,
        useNativeDriver: false,
        }).start();
    }, [notifications]);

    const handleToggle = () => {
        toggleNotifications(!notifications);
    };

    // Native switch dimensions
    const TRACK_WIDTH = 51;
    const TRACK_HEIGHT = 31;
    const THUMB_SIZE = 27;
    const MAX_TRANSLATE = TRACK_WIDTH - THUMB_SIZE;

    const thumbTranslate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, MAX_TRANSLATE],
    });

    const trackColor = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#767577', '#FB943C'],
    });

    const thumbColor = '#FFFFFF';

    return (
        <TouchableWithoutFeedback onPress={handleToggle}>
        <Animated.View
            style={{
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            backgroundColor: trackColor,
            justifyContent: 'center',
            }}
        >
            <Animated.View
            style={{
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: THUMB_SIZE / 2,
                backgroundColor: thumbColor,
                transform: [{ translateX: thumbTranslate }],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.25,
                shadowRadius: 1.5,
                elevation: 2, // for Android shadow
            }}
            />
        </Animated.View>
        </TouchableWithoutFeedback>
    );
};
