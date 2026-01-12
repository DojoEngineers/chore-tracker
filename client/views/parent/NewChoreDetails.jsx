import { useNavigation } from "@react-navigation/native"
import { useLogin } from "../../context/UserContext"
import Toast from 'react-native-toast-message'
import { Keyboard, Pressable, TouchableWithoutFeedback, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useEffect, useState } from "react"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { addChore, updateChore } from "../../services/chore.service"
import { PrimaryButton } from "../../components/PrimaryButton"
import { Switch } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { TextInput } from "react-native"
import { RepeatIcon } from "../../components/icons/RepeatIcon"
import { CameraIcon } from "../../components/icons/CameraIcon"
import { ClockIcon } from "../../components/icons/ClockIcon"
import { WriteIcon } from "../../components/icons/WriteIcon"
import { BackArrow } from "../../components/icons/BackArrow"
import { AssignedToIcon } from "../../components/icons/AssignedToIcon"
import dayjs from "dayjs"
import { NewChoreDropDown } from "../../components/NewChoreDropDown"
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { RadioButton } from 'react-native-paper'
import { DueDatePicker } from "../../components/DueDatePicker"

const WEEKDAYS = [
    { id: 0, short: 'S', full: 'Sunday' },
    { id: 1, short: 'M', full: 'Monday' },
    { id: 2, short: 'T', full: 'Tuesday' },
    { id: 3, short: 'W', full: 'Wednesday' },
    { id: 4, short: 'T', full: 'Thursday' },
    { id: 5, short: 'F', full: 'Friday' },
    { id: 6, short: 'S', full: 'Saturday' }
]

const REPEAT_OPTIONS = [
    { label: "Never", value: "never" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" }
]

const DEFAULT_FORM_VALUES = {
    kids: [],
    repeat: REPEAT_OPTIONS[0].value,
    weeklyRepeatDays: [],
    details: "",
    needsPics: false,
    dueDate: "",
    title: ""
}

export const NewChoreDetails = ({ route }) => {

    const [apiErrors, setApiErrors] = useState({})
    const [isOpen, setIsOpen] = useState({ kids: false, repeat: false, dueDate: false })
    const [formData, setFormData] = useState(() => ({ ...DEFAULT_FORM_VALUES, dueDate: dayjs().add(1, 'day').hour(18).minute(0) }))
    const [dateTimeMode, setDateTimeMode] = useState("")
    const [formErrors, setFormErrors] = useState({ dueDate: false, details: false })
    const [editScope, setEditScope] = useState('instance')
    const [isButtonLoading, setIsButtonLoading] = useState(false)

    const { title, chore } = route.params || {}
    const navigation = useNavigation()
    const { loggedInData, sendPush } = useLogin()
    const colorScheme = useColorScheme()
    const isDark = colorScheme === "dark"

    const kidOptions = loggedInData.family.children
        .filter(kid => kid.isActive)
        .map(kid => ({ label: kid.name, value: kid._id }))

    useEffect(() => {
        if (chore) {
            setFormData({
                kids: [chore.worker?._id],
                repeat: chore.repeat,
                weeklyRepeatDays: chore.weeklyRepeatDays,
                dueDate: dayjs(chore.dueDate),
                details: chore.details,
                needsPics: chore.needsPics,
                title: chore.title
            })
        } else if (title) {
            setFormData(prev => ({ ...prev, title }));
        }
    }, [chore, title])

    const handleDueDateChange = (name, value) => {
        let newDueDate
        if (dateTimeMode === 'date') {
            newDueDate = dayjs(value)
                .hour(formData.dueDate.hour())
                .minute(formData.dueDate.minute())
        } else {
            newDueDate = formData.dueDate
                .hour(dayjs(value).hour())
                .minute(dayjs(value).minute())
        }
        setIsOpen(prev => ({ ...prev, [name]: false }))
        handleChange(name, newDueDate)
    }

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        validateData(name, value)
    }

    const validateData = (name, value) => {
        const validations = {
            dueDate: value => (
                dayjs(value).isBefore(dayjs()) ? "Due date must not be in the past."
                    : false
            ),
            details: value => (
                value.length >= 100 ? "Details cannot exceed 100 characters."
                    : false
            )
        }
        setFormErrors(prev => ({ ...prev, [name]: validations[name](value) }))
    }

    const handleWeeklyRepeat = (day) => {
        setFormData(prev => {
            const currentDays = prev.weeklyRepeatDays || []
            let updatedDays

            if (currentDays.includes(day.id)) {
                updatedDays = currentDays.filter(d => d !== day.id)
            }
            else updatedDays = [...currentDays, day.id]

            return { ...prev, weeklyRepeatDays: updatedDays }
        })
    }

    const handleSubmit = async () => {
        if (isButtonLoading) return
        setIsButtonLoading(true)

        if (formErrors.details || formErrors.dueDate || formData.kids.length === 0) {
            Toast.show({ type: 'error', text1: "Please make corrections to the form." })
            setIsButtonLoading(false)
            return
        }

        const { details, kids, dueDate, needsPics, repeat, weeklyRepeatDays } = formData
        const baseData = {
            title: formData.title, details, creator: loggedInData._id,
            dueDate: dueDate.toISOString(), needsPics, repeat, weeklyRepeatDays
        }
        const promises = []
        const isEditMode = !!chore

        if (chore) {
            if (kids.includes(chore.worker._id)) {
                const finalData = { ...baseData, _id: chore._id, dateEdited: dayjs().toISOString(), editScope, templateId: chore.templateId }
                promises.push(updateChore(finalData))
            } else {
                // Kid removed from chore - deactivate it
                const finalData = { _id: chore._id, isActive: false, editScope, templateId: chore.templateId }
                promises.push(updateChore(finalData))
            }

            // Add chores for newly assigned kids
            const newKids = kids.filter(kid => kid !== chore.worker._id)
            newKids.forEach(kid => {
                const choreData = { ...baseData, worker: kid, stageDate: dayjs().toISOString() }
                promises.push(addChore(choreData))
            })
        }
        else {
            // Creating new chores
            kids.forEach(kid => {
                const choreData = { ...baseData, stageDate: dayjs().toISOString(), worker: kid }
                promises.push(addChore(choreData))
            })
        }

        try {
            // Wait for chores to be created/updated
            await Promise.all(promises);

            // Determine which kids should get notifications
            const kidsToNotify = kids; // Always notify ALL assigned kids (both create and edit)

            // Send notifications to the appropriate kids
            const notificationPromises = kidsToNotify
                .map(kidId => {
                    // Find the kid in the family
                    const kid = loggedInData.family.children.find(k => k._id === kidId);

                    if (kid?.pushTokens && kid.pushTokens.length > 0) {
                        // Different messages for create vs edit
                        const title = isEditMode
                            ? "Chore Updated! 🔄"
                            : "New Chore Assigned! 🧹";

                        const body = isEditMode
                            ? `Your chore "${formData.title}" has been updated`
                            : `You have a new chore: ${formData.title}`;

                        // Send to every token for this kid
                        return kid.pushTokens.map(token =>
                            sendPush(token, title, body)
                        );
                    }
                    return [];
                })
                .flat()
                .filter(Boolean);

            // Fire and forget notifications
            if (notificationPromises.length > 0) {
                Promise.allSettled(notificationPromises)
                    .then(results => {
                        const failed = results.filter(r => r.status === 'rejected');
                        if (failed.length > 0) {
                            console.log('Some notifications failed (non-blocking):', failed);
                        }
                    })
                    .catch(err => {
                        console.log('Notification error (non-blocking):', err);
                    });
            }

            // Navigate based on edit mode
            if (isEditMode) {
                Toast.show({ type: 'success', text1: "Chore updated!" })
                navigation.goBack()
            } else {
                Toast.show({ type: 'success', text1: "Chore created!" })
                navigation.pop(2)
            }
        } catch (error) {
            console.log("Updating / adding chores error:", error)
            setApiErrors(prev => ({ ...prev, chore: "Unable to save chore." }))
            Toast.show({ type: 'error', text1: "Unable to save chore." })
        } finally {
            setIsButtonLoading(false)
        }
    }

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            extraScrollHeight={100}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View className="flex-1 px-[16px] bg-lightBg dark:bg-grayBg">

                    <View className="flex-row w-full mt-[13%] items-center mb-4">
                        <Pressable
                            hitSlop={20}
                            className="ps-1 pe-6"
                            onPress={() => navigation.goBack()}
                        >
                            <BackArrow />
                        </Pressable>

                        <View className="flex-1">
                            <BrandBoldText
                                className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {formData.title}
                            </BrandBoldText>
                        </View>
                    </View>

                    {apiErrors.chore &&
                        <BrandText className="text-red-500 text-center">
                            {apiErrors.chore}
                        </BrandText>
                    }

                    {(chore && chore?.repeat !== 'never') && (
                        <View>
                            <RadioButton.Group
                                onValueChange={value => setEditScope(value)}
                                value={editScope}
                            >
                                <View className="flex-row justify-between mr-2">
                                    <View className="flex-row items-center">
                                        <RadioButton.Android
                                            value="instance"
                                            color={isDark ? "#FB943C" : "#84A99D"}
                                            uncheckedColor={isDark ? "#FB943C" : "#84A99D"}
                                        />

                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]"
                                        >
                                            Edit this chore
                                        </BrandText>
                                    </View>

                                    <View className="flex-row items-center">
                                        <RadioButton.Android
                                            value="repeating"
                                            color={isDark ? "#FB943C" : "#84A99D"}
                                            uncheckedColor={isDark ? "#FB943C" : "#84A99D"}
                                        />

                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]"
                                        >
                                            Edit repeating chores
                                        </BrandText>
                                    </View>
                                </View>
                            </RadioButton.Group>

                            <View className="h-[1px] my-6 bg-[#737780]"></View>
                        </View>
                    )}

                    <View className="flex-row justify-between items-center z-100 relative mx-2">
                        <View className="flex-row items-center gap-[10px]">
                            <AssignedToIcon />
                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                                Assign to
                            </BrandText>
                        </View>

                        <NewChoreDropDown
                            open={isOpen.kids} setOpen={(open) => setIsOpen(prev => ({ ...prev, kids: open }))} zIndex={100}
                            value={formData.kids} singleValue={false} items={kidOptions} isDark={isDark} placeholder="Pick kids"
                            setValue={(callback) => { setFormData(prev => ({ ...prev, kids: callback(prev.kids) })) }}
                        />
                    </View>

                    {formData.kids.length > 1 &&
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] text-center mt-3"
                        >
                            Each kid will be assigned a separate chore.
                        </BrandText>
                    }

                    <View className="h-[1px] my-6 bg-[#737780]"></View>

                    {(!chore || editScope === "repeating") &&
                        <View>
                            <View className="flex-row justify-between items-center relative z-10 mx-2">
                                <View className="flex-row items-center gap-[10px]">
                                    <RepeatIcon />

                                    <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                                        Repeat
                                    </BrandText>
                                </View>

                                <NewChoreDropDown
                                    open={isOpen.repeat} setOpen={(open) => setIsOpen(prev => ({ ...prev, repeat: open }))}
                                    value={formData.repeat} singleValue={true} items={REPEAT_OPTIONS} isDark={isDark} zIndex={10}
                                    setValue={(callback) => { setFormData(prev => ({ ...prev, repeat: callback(prev.repeat) })) }}
                                />
                            </View>

                            <View className="h-[1px] my-6 bg-[#737780]"></View>

                            {(formData.repeat === "never" || formData.repeat === "monthly")
                                ?
                                <DueDatePicker
                                    formErrors={formErrors}
                                    formData={formData}
                                    setIsOpen={setIsOpen}
                                    setDateTimeMode={setDateTimeMode}
                                />

                                : formData.repeat === "weekly" ?
                                    <View className="flex-1">
                                        <View className="flex-row flex-1 justify-between mx-8">
                                            {WEEKDAYS.map((day) => {
                                                const isSelected = formData.weeklyRepeatDays?.includes(day.id)
                                                return (
                                                    <Pressable
                                                        key={day.id}
                                                        className={`w-[30px] h-[30px] justify-center items-center rounded-full
                                                            ${isSelected
                                                                ? "bg-[#394C46] dark:bg-[#D0D1D4]"
                                                                : "bg-[#AEC4BC] dark:bg-[#3B4047]"}`}
                                                        onPress={() => handleWeeklyRepeat(day)}
                                                    >
                                                        <BrandBoldText className={`text-[18px] dark:text-[#111215]
                                                            ${isSelected
                                                                ? "text-[#F5F8F6]"
                                                                : "text-[#84A99D]"}`}
                                                        >
                                                            {day.short}
                                                        </BrandBoldText>
                                                    </Pressable>
                                                )
                                            })}
                                        </View>

                                        <View className="h-[1px] my-6 bg-[#737780]"></View>
                                    </View>

                                    : null
                            }
                        </View>
                    }

                    {(chore && editScope === "instance") &&
                        <DueDatePicker
                            formErrors={formErrors}
                            formData={formData}
                            setIsOpen={setIsOpen}
                            setDateTimeMode={setDateTimeMode}
                        />
                    }

                    <View className="flex-row items-center justify-between mx-2">
                        <View className="flex-row items-center gap-[10px]">
                            <ClockIcon />

                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                                Time due
                            </BrandText>
                        </View>

                        <Pressable
                            onPress={() => {
                                setIsOpen(prev => ({ ...prev, dueDate: true }))
                                setDateTimeMode("time")
                            }}
                            className="items-center bg-[#9FB6AE] dark:bg-[#22252B] border border-1
                                        border-[#D0D1D4] dark:border-[#D0D1D4] rounded-xl p-3"
                        >
                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                                {dayjs(formData.dueDate).format('h:mm A')}
                            </BrandText>
                        </Pressable>
                    </View>

                    <View className="h-[1px] my-6 bg-[#737780]"></View>

                    <View className="flex-row justify-between items-center pe-[16px] mx-2">
                        <View className="flex-row items-center gap-[10px]">
                            <CameraIcon width={20} />

                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                                Require photos?
                            </BrandText>
                        </View>

                        <Switch
                            value={formData.needsPics}
                            onValueChange={(needsPics) => setFormData(prev => ({ ...prev, needsPics }))}
                            trackColor={{
                                false: isDark ? "#6a6a6aff" : '#a5a5a5ff',
                                true: isDark ? "#a75c1aff" : "#618479ff"
                            }}
                            thumbColor={formData.needsPics
                                ? isDark ? "#FB943C" : "#84A99D"
                                : isDark ? "#d2d2d2ff" : "#979797ff"}
                            style={{ transform: [{ scale: 1.5 }] }}
                        />
                    </View>

                    <View className="h-[1px] my-6 bg-[#737780]"></View>

                    {formErrors.details &&
                        <BrandText className="text-red-500 text-center">
                            {formErrors.details}
                        </BrandText>
                    }

                    <View className="flex-row justify-between items-start mx-2">
                        <View className="flex-row items-center gap-[10px]">
                            <WriteIcon width={20} />

                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                                Notes
                            </BrandText>
                        </View>

                        <View className="shadow-md h-[100px] w-[70%]">
                            <TextInput
                                multiline={true}
                                numberOfLines={3}
                                value={formData.details}
                                onChangeText={(details) => handleChange("details", details)}
                                placeholder="Add optional notes"
                                placeholderTextColor={isDark ? "white" : "black"}
                                className="text-[16px] align-top h-[100px] border-[1px] border-[#D0D1D4] dark:border-white
                                    rounded-xl bg-white dark:bg-darkBg text-black dark:text-white p-2"
                            />
                        </View>
                    </View>

                    <View className="flex-1 justify-end my-[5%]">
                        <PrimaryButton onPress={handleSubmit} label={chore ? "Submit edits" : "Add"} disabled={isButtonLoading} />
                    </View>

                    <DateTimePickerModal
                        isVisible={isOpen.dueDate}
                        mode={dateTimeMode}
                        date={formData.dueDate.toDate()}
                        onConfirm={(dueDate) => handleDueDateChange("dueDate", dueDate)}
                        onCancel={() => setIsOpen(prev => ({ ...prev, dueDate: false }))}
                        minimumDate={dayjs().toDate()}
                        maximumDate={dayjs().add(1, 'month').toDate()}
                        display={dateTimeMode === 'date' ? 'inline' : 'spinner'}
                    />
                </View>
            </TouchableWithoutFeedback >
        </KeyboardAwareScrollView >
    )
}