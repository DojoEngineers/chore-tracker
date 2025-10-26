import { Pressable } from 'react-native'
import { BrandBoldText } from './text/BrandBoldText';

export const SwipeDeleteButton = ({ choreId, setModalVisible, setId }) => {

    return (
        <Pressable
            onPress={() => {
                setId(choreId)
                setModalVisible(true)
            }}
            className="bg-[#F40000] justify-center items-center px-4 rounded-2xl mt-4 p-3 ms-4"
        >
            <BrandBoldText
                className="text-white text-[14px]"
            >
                Delete
            </BrandBoldText>
        </Pressable>
    );
};