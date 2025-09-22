import DropDownPicker from "react-native-dropdown-picker"

export const NewChoreDropDown = ({open, setOpen, value, setValue, items,
    placeholder, isDark, zIndex}) => {

    return (
        <DropDownPicker
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={(callback) => {
                const newValue =
                typeof callback === 'function' ? callback(value) : callback;
                setValue(newValue)
            }}
            items={items}
            placeholder={placeholder || null}
            listMode="SCROLLVIEW"
            containerStyle={{
                width: 130
            }}
            style={{
                zIndex,
                backgroundColor: isDark ? "#22252B" : "#9FB6AE",
                border: 2,
                borderColor: isDark ? "#D0D1D4" : "#D0D1D4",
                borderRadius: 12
            }}
            textStyle={{
                color: isDark ? "white" : "#22252B",
                fontFamily: "nunito",
                fontSize: 16
            }}
            placeholderStyle={{
                color: isDark ? "white" : "#22252B",
                fontFamily: "nunito",
                fontSize: 16
            }}
            dropDownContainerStyle={{
                zIndex,
                backgroundColor: isDark ? "#22252B" : "#9FB6AE",
                width: 130,
                border: 2,
                borderColor: isDark ? "#D0D1D4" : "#9FB6AE",
                borderRadius: 12
            }}
            arrowIconStyle={{
                tintColor: isDark ? "white" : "#22252B",
                color: isDark ? "white" : "#22252B"
            }}
            tickIconStyle={{
                tintColor: isDark ? "white" : "#22252B"
            }}
            labelStyle={{
                color: isDark ? "white" : "#22252B",
                fontFamily: "nunito",
                fontSize: 16
            }}
        />
    )
}