import { useNavigation } from "@react-navigation/native"
import { useLogin } from "../../context/UserContext"
import Toast from 'react-native-toast-message'
import { Keyboard, Pressable, TouchableWithoutFeedback, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useState, useEffect } from "react"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { UserInput } from "../../components/UserInput"
import { CloseIcon } from "../../components/icons/CloseIcon"
import { BrandText } from "../../components/text/BrandText"
import SwitchToggle from 'react-native-switch-toggle';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker'
import { addChore } from "../../services/chore.service"

//NOTE: familyData in userContext is currently empty. Right now, I'm getting the data from inside of loggedInData.family

const DEFAULT_FORM_VALUES = {
    details: ""

}

export const NewChoreDetails = ({ route }) => {

    const [apiErrors, setApiErrors] = useState({})
    const [formData, setFormData] = useState(DEFAULT_FORM_VALUES)
    const [formErrors, setFormErrors] = useState({})

    const { title } = route.params
    const navigation = useNavigation()
    const { loggedInData, familyData } = useLogin()

    // an array of objects that hold the name/id of each child in family
    const [children, setChildren] = useState("")

    // dropdown picker variables (select a child)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([])
    // { label: 'Rue', value: 'edrttyfg' }, { label: 'Goo', value: 'dfkhhfks' }

    //"require photos" toggle boolean
    const [isOn, setIsOn] = useState(false);

    //Sets date/time to today
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())

    // controls when date/time modals are open/closed
    const [openTime, setOpenTime] = useState(false)
    const [openDate, setOpenDate] = useState("")


    useEffect(() => {
        console.log("loggedindata", loggedInData)
        // console.log("familyData", familyData)
        // console.log("children", children)
        if (loggedInData.family) {
            setChildren(loggedInData.family.children)
        }
        if (children && children.length > 0) {
            setItems(children.map(member => ({
                label: member.name,
                value: member._id
            })))
            console.log("added kids!")
        }

    }, [familyData, children])


    // Dynamically set form data
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        validateData(name, value)
    }

    // Validate form inputs dynamically
    const validateData = (name, value) => {
        const validations = {
            details: value => (
                value.length < 5 ? "Details must be at least 5 characters."
                    : value.length > 250 ? "Details cannot exceed 250 characters."
                        : false
            )
        }
        setFormErrors(prev => ({ ...prev, [name]: validations[name](value) }))
    }

    // Check for errors before submitting form
    const isReadyToSubmit = () => {
        for (let key in formErrors) {
            if (formErrors[key] != false || formData[key] == "") {
                console.log("not ready")
                return false
            }
        }
        console.log("ready")
        return true
    }

    // Submit form
    const handleSubmit = async () => {
        if (!isReadyToSubmit()) {
            Toast.show({
                type: 'error',
                text1: "Please make corrections to the form."
            })
            return
        }
        else {
            console.log("submitting...")
            // combining date and time in the frontend (best practice)
            const dateTime = new Date(date);
            dateTime.setHours(
                time.getHours(),
                time.getMinutes(),
                0, 0
            );
            const allData = {
                title: title, details: formData.details,
                creator: loggedInData._id, worker: value, dueDate: dateTime, needsPics: isOn
            }
            addChore(allData)
            .then(res => {
                if (res) {
                    Toast.show({
                        type: 'success',
                        text1: "Chore added"
                    })
                    navigation.navigate("ParentDashboard", {animationType: "fade"})
                }
                else {
                    Toast.show({
                        type: 'error',
                        text1: "Unable to add chore"
                    })
                }

            })
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={20}
            >
                <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px]">

                    <View className="flex-row w-full mt-[100px] items-center mb-8">
                        <Pressable
                            className="ps-6 pe-8"
                            onPress={() => navigation.navigate("ParentDashboard", {animationType: "fade"})}
                        >
                            <CloseIcon />
                        </Pressable>
                        <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                            New Chore
                        </BrandBoldText>
                    </View>

                    <View>
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] ps-2 my-5"
                        >
                            Notes
                        </BrandText>

                        <UserInput
                            value={formData.details}
                            onChangeText={(text) => handleChange('details', text)}
                            placeholder="Add notes"
                            error={formErrors.details}
                        />
                    </View>

                    {/* <View className="flex-row justify-between items-center">
                        <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                            Assign to
                        </BrandText>
                    </View> */}
                    <View>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder="Assign to"
                            listMode="SCROLLVIEW"
                            style={{
                                backgroundColor: '#000000',
                                borderColor: '#333333',
                            }}
                            textStyle={{
                                color: '#ffffff',
                            }}
                            placeholderStyle={{
                                color: '#ffffff',
                            }}

                            // Open state styling
                            dropDownContainerStyle={{
                                backgroundColor: '#000000',
                                borderColor: '#333333',
                            }}
                            listItemLabelStyle={{
                                color: '#ffffff',
                            }}
                            selectedItemLabelStyle={{
                                color: '#ffffff',
                                fontWeight: 'bold',
                            }}

                            // Arrow styling
                            arrowIconStyle={{
                                tintColor: '#ffffff',
                            }}
                            tickIconStyle={{
                                tintColor: '#ffffff',
                            }}

                            // Additional styling
                            labelStyle={{
                                color: '#ffffff',
                            }}
                        />
                    </View>

                    <BrandBoldText>Due date:</BrandBoldText>
                    <View style={{ marginTop: 20 }}>
                        <Pressable onPress={() => { setOpenDate(true) }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "lightblue",
                                borderRadius: 5,
                                paddingHorizontal: 20,
                                paddingVertical: 10
                            }}
                        ><BrandBoldText>Select a date</BrandBoldText></Pressable>
                        {openDate &&
                            <DateTimePicker value={date} mode="date" display="default"
                                onChange={(event, selectedDate) => {
                                    setOpenDate(false);
                                    if (selectedDate) { setDate(selectedDate) };
                                }} />
                        }
                        <BrandBoldText>Date: {date.toDateString()} </BrandBoldText>
                    </View>
                    <View style={{ marginVertical: 20 }}>
                        <Pressable onPress={() => { setOpenTime(true) }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "lightblue",
                                borderRadius: 5,
                                paddingHorizontal: 20,
                                paddingVertical: 10
                            }}
                        ><BrandBoldText>Select a time</BrandBoldText></Pressable>
                        {openTime &&
                            <DateTimePicker value={time} mode="time" display="default"
                                onChange={(event, selectedTime) => {
                                    setOpenTime(false);
                                    if (selectedTime) { setTime(selectedTime) };
                                }} />
                        }
                        <BrandBoldText>Time: {time.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                        })}</BrandBoldText>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", width: "100%" }}>
                        <View>
                            <BrandBoldText>Require photos?</BrandBoldText>
                        </View>
                        <SwitchToggle
                            switchOn={isOn}
                            onPress={() => setIsOn(!isOn)}
                            backgroundColorOn='#6D6D6D'
                            backgroundColorOff='#C4C4C4'
                            circleColorOff='#343434ff'
                            circleColorOn='#ffffffff'
                            containerStyle={{
                                marginTop: 16,
                                marginBottom: 16,
                                width: 106,
                                height: 48,
                                borderRadius: 25,
                                padding: 5,
                            }}
                            circleStyle={{
                                width: 30,
                                height: 30,
                                borderRadius: 20,
                            }}
                        />
                    </View>

                    <View className="mt-8">
                        <Pressable onPress={handleSubmit} style={{ backgroundColor: "#FB943C", padding: 20 }}><BrandText>Create</BrandText></Pressable>
                    </View>

                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}