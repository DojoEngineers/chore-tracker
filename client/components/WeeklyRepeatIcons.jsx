import { View } from "react-native"
import { BrandBoldText } from "./text/BrandBoldText";
import { useLogin } from "../context/UserContext";

const WEEKDAYS = [
    { id: 0, short: 'S', full: 'Sunday' },
    { id: 1, short: 'M', full: 'Monday' },
    { id: 2, short: 'T', full: 'Tuesday' },
    { id: 3, short: 'W', full: 'Wednesday' },
    { id: 4, short: 'T', full: 'Thursday' },
    { id: 5, short: 'F', full: 'Friday' },
    { id: 6, short: 'S', full: 'Saturday' }
]

export const WeeklyRepeatIcons = ({chore, circleSize, fontSize}) => {

    const {loggedInData} = useLogin()

    return (
        <View className="flex-row">
            {WEEKDAYS.map((day) => {
                const isSelected = chore.weeklyRepeatDays?.includes(day.id)

                return (
                    <View
                    style={{
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                        marginRight: day.id === 6 ? 0 : 4,
                    }}
                    key={day.id}
                    className={` justify-center items-center
                        ${isSelected
                            ? "bg-[#394C46] dark:bg-[#D0D1D4]"
                            : "bg-[#AEC4BC] dark:bg-[#3B4047]"}`}
                    >
                        <BrandBoldText
                        style={{ fontSize }}
                        className={`dark:text-[#111215]
                            ${isSelected
                                ? "text-[#F5F8F6]"
                                : "text-[#84A99D]"}`}
                        >
                            {day.short}
                        </BrandBoldText>
                    </View>
                )
            })}
        </View>
    )
}