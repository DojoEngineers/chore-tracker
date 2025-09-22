import { useNavigation } from "@react-navigation/native"
import { useLogin, useNotifications } from "../../context/UserContext"
import Toast from 'react-native-toast-message'
import { Keyboard, Pressable, TouchableWithoutFeedback, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useEffect, useState } from "react"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
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
import { NewChoreDropDown } from "../../components/NewChoreDropDown"
import DateTimePickerModal from 'react-native-modal-datetime-picker'

const weekdays = [
    { id: 0, short: 'S', full: 'Sunday' },
    { id: 1, short: 'M', full: 'Monday' },
    { id: 2, short: 'T', full: 'Tuesday' },
    { id: 3, short: 'W', full: 'Wednesday' },
    { id: 4, short: 'T', full: 'Thursday' },
    { id: 5, short: 'F', full: 'Friday' },
    { id: 6, short: 'S', full: 'Saturday' }
]

const repeatOptions = [
    { label: "Never", value: "never" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" }
]

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
    
    const [apiErrors, setApiErrors] = useState({})
    const [openKids, setOpenKids] = useState(false)
    const [kid, setKid] = useState({})
    const [openRepeat, setOpenRepeat] = useState(false)
    const [repeat, setRepeat] = useState(repeatOptions[0].value)
    const [weekday, setWeekday] = useState(null)
    const [openDateTime, setOpenDateTime] = useState(false)
    const [dateTime, setDateTime] = useState(dayjs().add(1, 'day').hour(18).minute(0))
    const [mode, setMode] = useState("")
    const [dateTimeError, setDateTimeError] = useState("")
    
    const [details, setDetails] = useState("")
    const [detailsError, setDetailsError] = useState("")
    const [requirePhotos, setRequirePhotos] = useState(false)
    
    const { title } = route.params
    const navigation = useNavigation()
    const { loggedInData } = useLogin()
    const colorScheme = useColorScheme()
    const isDark = colorScheme === "dark"

    const kids = loggedInData.family.children
        .filter(kid => kid.isActive)
        .map(kid => ({label: kid.name, value: kid._id}))

    useEffect(() => {
        if (dayjs(dateTime).isBefore(dayjs())) {
            setDateTimeError("Due date must not be in the past.")
        }
        else setDateTimeError(false)
    }, [dateTime])

    const handleDateTimeChange = (selected) => {
        if (mode === 'date') handleDateChange(selected)
        else handleTimeChange(selected)
    }

    const handleDateChange = (selectedDate) => {
        const newDateTime = dayjs(selectedDate)
            .hour(dateTime.hour())
            .minute(dateTime.minute())
        setDateTime(newDateTime)
        setOpenDateTime(false)
    }

    const handleTimeChange = (selectedTime) => {
        const newDateTime = dateTime
            .hour(dayjs(selectedTime).hour())
            .minute(dayjs(selectedTime).minute())
        setDateTime(newDateTime)
        setOpenDateTime(false)
    }
    
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
        if (detailsError || dateTimeError) {
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
                worker: kid, dueDate: dateTime.toISOString(), needsPics: requirePhotos, repeat: repeat, day: weekday
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

                    <View className="flex-row w-full mt-[70px] items-center mb-4">
                        <Pressable
                            hitSlop={20}
                            className="ps-1 pe-6"
                            onPress={() => navigation.goBack()}
                        >
                            <BackArrow />
                        </Pressable>

                        <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                            {title}
                        </BrandBoldText>
                    </View>

                    {apiErrors.addChore &&
                        <BrandText className="text-red-500 text-center">
                            {apiErrors.addChore}
                        </BrandText>
                    }

                    <View className="flex-row justify-between items-center z-100 relative">
                        <View className="flex-row items-center gap-[10px]">
                            <AssignedToIcon />
                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                                Assign to
                            </BrandText>
                        </View>

                        <NewChoreDropDown
                            open={openKids} setOpen={setOpenKids} value={kid} setValue={setKid}
                            items={kids} isDark={isDark} placeholder="Pick one" zIndex={100}
                        />
                    </View>

                    <View className="h-[1px] my-6 bg-[#737780]"></View>

                    <View className="flex-row justify-between items-center relative z-10">
                        <View className="flex-row items-center gap-[10px]">
                            <RepeatIcon />
                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                                Repeat
                            </BrandText>
                        </View>

                        <NewChoreDropDown
                            open={openRepeat} setOpen={setOpenRepeat} value={repeat}
                            setValue={setRepeat} items={repeatOptions} isDark={isDark} zIndex={10}
                        />
                    </View>

                    {(repeat === "never" || repeat === "monthly")
                        ?
                            <View>
                                <View className="h-[1px] my-6 bg-[#737780]"></View>

                                {dateTimeError &&
                                    <BrandText className="text-red-500 text-center">
                                        {dateTimeError}
                                    </BrandText>
                                }

                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center gap-[10px]">
                                        <DateIcon />
                                        <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                                            Due date
                                        </BrandText>
                                    </View>

                                    <Pressable
                                        onPress={() => {
                                            setOpenDateTime(true)
                                            setMode("date")
                                        }}
                                        className="items-center bg-[#9FB6AE] dark:bg-[#22252B] border border-1
                                        border-[#9FB6AE] dark:border-[#D0D1D4] rounded-xl p-3"
                                    >
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]"
                                        >
                                            {dayjs(dateTime).format('MMM D, YYYY')}
                                        </BrandText>
                                    </Pressable>
                                </View>
                            </View>

                        : repeat === "weekly" ?
                            <View>
                                <View className="h-[1px] my-6 bg-[#737780]"></View>

                                <View className="flex-row flex-1 justify-between mx-8">
                                    {weekdays.map((day) => (
                                        <Pressable
                                            key={day.id}
                                            className={`w-[30px] h-[30px] justify-center items-center rounded-full
                                                ${weekday === day.id
                                                    ? isDark ? "bg-gray-100" : "bg-[#84A99D]"
                                                    : isDark ? "bg-gray-400" : "bg-[#A1A4AA]"}`}
                                            onPress={() => setWeekday(day.id)}
                                        >
                                            <BrandBoldText className="text-[#22252B] text-[16px]">
                                                {day.short}
                                            </BrandBoldText>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                        : null
                    }

                    <View className="h-[1px] my-6 bg-[#737780]"></View>

                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-[10px]">
                            <ClockIcon />

                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                                Time due
                            </BrandText>
                        </View>

                        <Pressable
                            onPress={() => {
                                setOpenDateTime(true)
                                setMode("time")
                            }}
                            className="items-center bg-[#9FB6AE] dark:bg-[#22252B] border border-1
                                        border-[#9FB6AE] dark:border-[#D0D1D4] rounded-xl p-3"
                        >
                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                                {dayjs(dateTime).format('h:mm A')}
                            </BrandText>
                        </Pressable>
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

                    <DateTimePickerModal
                        isVisible={openDateTime}
                        mode={mode}
                        date={dateTime.toDate()}
                        onConfirm={handleDateTimeChange}
                        onCancel={() => setOpenDateTime(false)}
                        minimumDate={dayjs().toDate()}
                        maximumDate={dayjs().add(1, 'month').toDate()}
                        display={mode === 'date' ? 'inline' : 'spinner'}
                    />
                </View>
            </KeyboardAwareScrollView >
        </TouchableWithoutFeedback >
    )
}