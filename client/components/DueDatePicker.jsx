import { View, Pressable } from 'react-native';
import dayjs from 'dayjs';
import { BrandText } from './text/BrandText';
import { DateIcon } from './icons/DateIcon';

export const DueDatePicker = ({formErrors, formData, setIsOpen, setDateTimeMode}) => {

    return (
        <View>
            {formErrors.dueDate &&
                <BrandText className="text-red-500 text-center">
                    {formErrors.dueDate}
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
                        setIsOpen(prev => ({...prev, dueDate: true}))
                        setDateTimeMode("date")
                    }}
                    className="items-center bg-[#9FB6AE] dark:bg-[#22252B] border border-1
                    border-[#D0D1D4] dark:border-[#D0D1D4] rounded-xl p-3"
                >
                    <BrandText
                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]"
                    >
                        {dayjs(formData.dueDate).format('MMM D, YYYY')}
                    </BrandText>
                </Pressable>
            </View>

            <View className="h-[1px] my-6 bg-[#737780]"></View>
        </View>
    )
}