import { useNavigation } from "@react-navigation/native"
import { useLogin, useNotifications } from "../../context/UserContext"
import Toast from 'react-native-toast-message'
import { Keyboard, Pressable, TouchableWithoutFeedback, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useState, useEffect } from "react"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker'
import { addChore } from "../../services/chore.service"
import { PrimaryButton } from "../../components/PrimaryButton"
import { Switch } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { TextInput } from "react-native"
import { RepeatIcon } from "../../components/icons/RepeatIcon"
import { CameraIcon } from "../../components/icons/CameraIcon"
import { ClockIcon } from "../../components/icons/ClockIcon"
import { WriteIcon } from "../../components/icons/WriteIcon"
import { BackArrow } from "../../components/icons/BackArrow"
import { DateIcon } from "../../components/icons/DateIcon"
import { AssignedToIcon } from "../../components/icons/AssignedToIcon"
import dayjs from "dayjs"

const weekdays = [
    { id: 1, short: 'Mon', full: 'Monday' },
    { id: 2, short: 'Tue', full: 'Tuesday' },
    { id: 3, short: 'Wed', full: 'Wednesday' },
    { id: 4, short: 'Thu', full: 'Thursday' },
    { id: 5, short: 'Fri', full: 'Friday' },
    { id: 6, short: 'Sat', full: 'Saturday' },
    { id: 0, short: 'Sun', full: 'Sunday' },
];

export const NewChoreDetails = ({ route }) => {

    const {
        expoPushToken,
        sendTestNotification,
        sendPushNotification,
        isLoading
    } = useNotifications()
    
    //  send test 
    const handleSendTest = async () => {
        const result = await sendTestNotification();
        if (result?.success) {
        Alert.alert('Success', 'Test notification sent!')
        }
    }

    // Send chore reminder
    const handleSendChoreReminder = async () => {
        if (!expoPushToken) {
            Alert.alert('Error', 'Push token not available');
            return;
        }

        const result = await NotificationService.sendChoreReminder(
            expoPushToken,
            'Take out trash',
            'today at 6 PM'
        );

        if (result?.success) {
            Alert.alert('Success', 'Chore reminder sent!');
        }
    };

    // Send chore completed notification
    const handleSendChoreCompleted = async () => {
        if (!expoPushToken) {
            Alert.alert('Error', 'Push token not available');
            return;
        }

        const result = await NotificationService.sendChoreCompleted(
            expoPushToken,
            'Kitchen cleaning',
            'John'
        );

        if (result?.success) {
            Alert.alert('Success', 'Chore completed notification sent!');
        }
    };

    // Notification code ends here

    const today = dayjs().toDate()
    const aMonthFromNow = dayjs().add(1, 'month').toDate()
    const tomorrow = dayjs().add(1, 'day').toDate()
    const aWeekFromNow = dayjs().add(7, 'day')
    const sixPM = dayjs().hour(18).minute(0).second(0).millisecond(0).toDate()
    
    const [repeat, setRepeat] = useState([{ label: "never", value: "never" }, { label: "daily", value: "daily" },
        { label: "weekly", value: "weekly" }, { label: "monthly", value: "monthly" }])
    const [openRepeat, setOpenRepeat] = useState(false)
    const [repeatValue, setRepeatValue] = useState(repeat[0].value)
    const [apiErrors, setApiErrors] = useState({})
    const [details, setDetails] = useState("")
    const [detailsError, setDetailsError] = useState("")
    const [kid, setKid] = useState(null)
    const [requirePhotos, setRequirePhotos] = useState(false)
    const [date, setDate] = useState(tomorrow)
    const [time, setTime] = useState(sixPM)
    const [dayValue, setDayValue] = useState(null)
    const [openKids, setOpenKids] = useState(false)
    const [openTime, setOpenTime] = useState(false)
    const [openDate, setOpenDate] = useState(false)
    
    const { title } = route.params
    const navigation = useNavigation()
    const { loggedInData } = useLogin()
    const colorScheme = useColorScheme()
    const isDark = colorScheme === "dark"

    const kids = loggedInData.family.children
        .filter(kid => kid.isActive)
        .map(kid => ({label: kid.name, value: kid._id}))

    const handleDetailsChange = (formDetails) => {
        setDetails(formDetails)
        if (formDetails.length >= 100) {
            setDetailsError("Details cannot exceed 100 characters.")
        }
        else if (formDetails.length < 5) {
            setDetailsError("Details must be at least 5 characters.")
        }
        else (
            setDetailsError(false)
        )
    }

    const handleSubmit = async () => {
        if (detailsError) {
            Toast.show({
                type: 'error',
                text1: "Please make corrections to the form."
            })
            return
        }

        else {
            handleSendTest()
            const dateTime = dayjs(date)
                .hour(dayjs(time).hour())
                .minute(dayjs(time).minute())
                .second(0)
                .millisecond(0)
            const allData = {
                title, details, creator: loggedInData._id, stageDate: dayjs().toISOString(),
                worker: kid, dueDate: dateTime.toISOString(), needsPics: requirePhotos, repeat: repeatValue, day: dayValue
            }

            addChore(allData)
                .then(() => {
                    Toast.show({
                        type: 'success',
                        text1: "Chore created!"
                    })
                    navigation.replace("Dashboard", { animationType: "fade_from_bottom" })
                })
                .catch((error) => {
                    console.log("addChore error:", error)
                    setApiErrors(prev => ({...prev, addChore: "Unable to create chore."}))
                    Toast.show({
                        type: 'error',
                        text1: "Unable to create chore."
                    })
                })
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={100}
            >
                <View className="flex-1 px-[16px] bg-lightBg dark:bg-grayBg">

                    <View className="flex-row w-full mt-[70px] items-center mb-8">
                        <Pressable
                            hitSlop={20}
                            className="ps-6 pe-8"
                            onPress={() => navigation.goBack()}
                        >
                            <BackArrow />
                        </Pressable>
                        <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                            {title}
                        </BrandBoldText>
                    </View>

                    <View className="w-full flex-row justify-between items-center z-100 relative">

                        <View className="flex-row items-center gap-[10px]">
                            <AssignedToIcon />
                            <BrandBoldText className="text-black dark:text-white">Assign to</BrandBoldText>
                        </View>

                        <DropDownPicker
                            open={openKids}
                            setOpen={setOpenKids}
                            items={kids}
                            value={kid}
                            setValue={setKid}
                            placeholder="Pick one"
                            listMode="SCROLLVIEW"
                            containerStyle={{
                                width: 150
                            }}
                            style={{
                                zIndex: 100,
                                backgroundColor: isDark ? "#22252B" : "white",
                                elevation: 100,
                                border: 2,
                                borderColor: isDark ? "white" : "black",
                            }}
                            arrowIconContainerStyle={{
                                marginRight: 10
                            }}
                            textStyle={{
                                color: isDark ? "white" : "black",
                                paddingLeft: 10,
                                fontFamily: "nunito"
                            }}
                            placeholderStyle={{
                                color: isDark ? "white" : "black",
                                fontFamily: "nunito"
                            }}
                            dropDownContainerStyle={{
                                zIndex: 100,
                                elevation: 100,
                                backgroundColor: isDark ? "#22252B" : "white",
                                width: 150
                            }}
                            arrowIconStyle={{
                                tintColor: isDark ? "white" : "black",
                                marginLeft: 5,
                                color: isDark ? "white" : "black"
                            }}
                            tickIconStyle={{
                                tintColor: isDark ? "white" : "black",
                            }}
                            labelStyle={{
                                color: isDark ? "white" : "black",
                            }}
                        />
                    </View>

                    <View className="h-[1px] mt-8 mb-4 bg-black dark:bg-white"></View>
                    <View className="flex-row w-[100%] justify-between items-start mt-[20px] relative z-10">
                        <View className="flex-row items-center gap-[10px]">
                            <RepeatIcon width={20} />
                            <BrandBoldText className="text-black dark:text-white">Repeat</BrandBoldText>
                        </View>
                        <DropDownPicker
                            open={openRepeat}
                            value={repeatValue}
                            items={repeat}
                            setOpen={setOpenRepeat}
                            setValue={setRepeatValue}
                            setItems={setRepeat}
                            listMode="SCROLLVIEW"
                            containerStyle={{
                                width: 150, // This controls the overall container
                            }}
                            style={{
                                zIndex: 10,
                                backgroundColor: isDark ? "#22252B" : "white",
                                elevation: 10,
                                border: 2,
                                borderColor: isDark ? "white" : "black",
                                color: isDark ? "white" : "black"
                            }}

                            arrowIconContainerStyle={{
                                marginRight: 10, // Moves arrow away from right edge
                            }}
                            textStyle={{
                                color: isDark ? "white" : "black",
                                paddingLeft: 10,
                                fontFamily: "nunito"
                            }}

                            // Open state styling
                            dropDownContainerStyle=
                            {{
                                zIndex: 10,
                                backgroundColor: isDark ? "#22252B" : "white",
                                elevation: 10,
                                width: 150,
                            }}

                            // Arrow styling
                            arrowIconStyle={{
                                tintColor: isDark ? "white" : "black",
                                marginLeft: 5,
                                color: isDark ? "white" : "black"
                            }}
                            tickIconStyle={{
                                tintColor: isDark ? "white" : "black",
                            }}

                            // styles the selected value
                            labelStyle={{
                                color: isDark ? "white" : "black",
                            }}
                        />
                    </View>

                    {(repeatValue == "never" || repeatValue == "monthly") &&
                        <>
                            <View className="h-[1px] mt-8 mb-4 bg-black dark:bg-white"></View>
                            <View className="w-[100%] flex-row items-start gap-20 justify-between">
                                <View className="flex-row items-center gap-[10px]">
                                    <DateIcon />
                                    <BrandBoldText className="text-black dark:text-white pt-[10px] pb-[10px]">Due Date</BrandBoldText>
                                </View>
                                <View className="flex-col items-center z-1">
                                    <BrandText className="text-black dark:text-white">Select date</BrandText>
                                    <Pressable onPress={() => { setOpenDate(true) }}
                                        className="z-1 flex-1 items-center bg-white dark:bg-darkBg border border-1 border-black
                                            dark:border-white rounded-lg px-[20px] py-[10px]"
                                    >
                                        <BrandBoldText className="text-black dark:text-white flex justify-center">
                                            {repeatValue == "never" ? dayjs(date).format('ddd MMM D YYYY') :
                                                dayjs(date).format('MMM D')} </BrandBoldText>
                                    </Pressable>
                                    {openDate &&
                                        <DateTimePicker value={date} mode="date" display="default"
                                            onChange={(event, selectedDate) => {
                                                setOpenDate(false);
                                                if (selectedDate) { setDate(selectedDate) };
                                            }}
                                            minimumDate={today}
                                            maximumDate={aMonthFromNow}
                                        />
                                    }
                                </View>
                            </View>
                        </>
                    }
                    {repeatValue == "weekly" &&
                        <>
                            <View className="h-[1px] mt-8 mb-4 bg-black dark:bg-white"></View>
                            <View className="flex-row w-full">
                                {weekdays.map((day) => (
                                    <Pressable
                                        key={day.id}
                                        className={`w-[42px] h-[42px] flex justify-center items-center m-1 rounded-full ${dayValue == day.id ? isDark ? "bg-gray-100" : "bg-gray-600" : isDark ? "bg-gray-400" : "bg-gray-400"}`}
                                        onPress={() => setDayValue(day.id)}
                                    >
                                        <BrandBoldText className={"text-white dark:text-black"}>
                                            {day.short}
                                        </BrandBoldText>
                                    </Pressable>
                                ))}
                            </View>
                        </>
                    }
                    <View className="h-[1px] mt-8 mb-4 bg-black dark:bg-white"></View>
                    <View className="w-[100%] gap-20 flex-row items-start justify-between">
                        <View className="flex-row items-center gap-[10px]">
                            <ClockIcon />
                            <BrandBoldText className="text-black dark:text-white flex" style={{ paddingVertical: 10 }}>Time Due</BrandBoldText>
                        </View>
                        <View className="flex-col items-center">
                            <BrandText className="text-black dark:text-white">Select time</BrandText>
                            <Pressable onPress={() => { setOpenTime(true) }}
                                className="flex items-center bg-white dark:bg-darkBg border border-black dark:border-white rounded-lg px-5 py-2"
                            >
                                <BrandBoldText className="text-black dark:text-white">
                                {dayjs(time).format('h:mm A')}</BrandBoldText></Pressable>
                            {openTime &&
                                <DateTimePicker value={time} mode="time" display="default"
                                    onChange={(event, selectedTime) => {
                                        setOpenTime(false);
                                        if (selectedTime) { setTime(selectedTime) };
                                    }} />
                            }
                        </View>
                    </View>

                    <View className="h-[1px] mt-8 mb-4 bg-black dark:bg-white"></View>
                    <View className="flex-row justify-between items-center pe-[16px]">
                        < View className="flex-row items-center gap-[10px]">
                            <CameraIcon width={20} />
                            <BrandBoldText className="text-black dark:text-white">Require photos?</BrandBoldText>
                        </View>
                        <Switch
                            value={requirePhotos}
                            onValueChange={setRequirePhotos}
                            trackColor={{ false: isDark ? "#6a6a6aff" : '#a5a5a5ff', true: isDark ? "#a75c1aff" : "#618479ff" }}
                            thumbColor={requirePhotos ?
                                isDark ? "#FB943C" : "#84A99D"
                                : isDark ? "#d2d2d2ff" : "#979797ff"}
                            style={{ transform: [{ scale: 1.5 }] }}
                        />
                    </View>

                    <View className="h-[1px] mt-6 mb-4 bg-black dark:bg-white"></View>

                    <View className="flex-row justify-between items-start">
                        <View className="flex-row items-center gap-[10px] mt-4">
                            <WriteIcon width={20} />
                            <BrandBoldText className="text-lightPrimaryText dark:text-darkPrimaryText">
                                Notes
                            </BrandBoldText>
                        </View>
                        <View className=" shadow-md h-[100px] w-[70%] mt-4">
                            <TextInput
                                multiline={true}
                                numberOfLines={3}
                                value={details.details}
                                onChangeText={(text) => handleDetailsChange('details', text)}
                                placeholder="Add optional note"
                                error={detailsError.details}
                                className="text-[15px] align-top h-[100px] border-[1px] borderblack dark:border-white rounded-lg bg-white dark:bg-darkBg text-black dark:text-white px-[10px]"
                                placeholderTextColor={isDark ? "white" : "black"}
                            />
                        </View>

                    </View>
                    <View className="mt-8 mb-14">
                        <PrimaryButton onPress={handleSubmit} disabled={!expoPushToken} label="Add" />
                    </View>

                </View>
            </KeyboardAwareScrollView >
        </TouchableWithoutFeedback >
    )
}