import DropDownPicker from "react-native-dropdown-picker"
import { useLogin } from "../context/UserContext"
import { useColorScheme } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { useState } from "react"

export const ThemeDropDown = () => {

    const [open, setOpen] = useState(false)
    const [items, setItems] = useState([
        { label: 'Auto', value: 'a' },
        { label: 'Light', value: 'l' },
        { label: 'Dark', value: 'd' },
    ])

    const {theme, setAppTheme} = useLogin()
    const colorScheme = useColorScheme()

    return (
        <DropDownPicker
            open={open}
            value={theme}
            placeholder=''
            items={items}
            setOpen={setOpen}
            setValue={callback => {
                const newValue = callback(theme)
                setAppTheme(newValue)
            }}
            setItems={setItems}
            containerStyle={{ width: 90 }}
            style={{
                backgroundColor: colorScheme === 'dark' ? '#22252B' : '#F5F8F6',
                borderColor: colorScheme === 'dark' ? '#fff' : '#000',
            }}
            labelStyle={{
                fontFamily: 'Nunito',
                fontSize: 14,
                color: colorScheme === 'dark' ? '#fff' : '#000',
            }}
            listItemLabelStyle={{
                fontFamily: 'Nunito',
                color: colorScheme === 'dark' ? '#fff' : '#000',
                fontSize: 14,
            }}
            dropDownContainerStyle={{
                backgroundColor: colorScheme === 'dark' ? '#22252B' : '#F5F8F6',
                borderColor: colorScheme === 'dark' ? '#fff' : '#000',
            }}
            ArrowDownIconComponent={() => (
                <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color={colorScheme === 'dark' ? '#fff' : '#000'}
                />
            )}
            ArrowUpIconComponent={() => (
                <MaterialIcons
                    name="keyboard-arrow-up"
                    size={24}
                    color={colorScheme === 'dark' ? '#fff' : '#000'}
                />
            )}
            TickIconComponent={() => (
                <MaterialIcons
                    name="check"
                    size={18}
                    color={colorScheme === 'dark' ? '#fff' : '#000'}
                />
            )}
        />
    )
}