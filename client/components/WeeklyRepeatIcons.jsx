import { View } from "react-native"
import { BrandBoldText } from "./text/BrandBoldText";

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

    return (
        <View className="flex-row">
            {WEEKDAYS.map((day) => {
                const isSelected = chore.weeklyRepeatDays?.includes(day.id)

                return (
                    <View
                    key={day.id}
                    className={`w-[${circleSize}px] h-[${circleSize}px] justify-center items-center rounded-full
                        ${isSelected ? "bg-[#84A99D] dark:bg-gray-100": "bg-[#A1A4AA] dark:bg-gray-400"}
                        ${day.id === 6 ? "" : "mr-1"}`}
                    >
                        <BrandBoldText className={`text-[#22252B] text-[${fontSize}px]`}>
                            {day.short}
                        </BrandBoldText>
                    </View>
                )
            })}
        </View>
    )
}