import { useCallback } from "react";
import DropDownPicker from "react-native-dropdown-picker"

export const NewChoreDropDown = ({open, setOpen, value, setValue, items,
    placeholder, isDark, zIndex, singleValue}) => {

    const normalizedValue = singleValue ? value : Array.isArray(value) ? value : []

    let multipleText = ""
    if (!singleValue) {
        if (normalizedValue.length === 1) {
            const selectedItem = items.find(item => item.value === normalizedValue[0]);
            multipleText = selectedItem ? selectedItem.label : ""
        } else if (normalizedValue.length > 1) {
            multipleText = `${normalizedValue.length} kids`;
        }
    }

    return (
        <DropDownPicker
            multiple={!singleValue}
            multipleText={multipleText || null}
            open={open}
            setOpen={setOpen}
            value={normalizedValue}
            setValue={setValue}
            items={items}
            placeholder={placeholder || null}
            listMode="SCROLLVIEW"
            containerStyle={{
                width: 130
            }}
            style={{
                zIndex,
                backgroundColor: isDark ? "#22252B" : "#9FB6AE",
                borderWidth: 1,
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
                borderWidth: 1,
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