import { Modal, Pressable, Image } from 'react-native'

export const ImageModal = ({visible, setVisible, imageUri}) => {

    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
            onRequestClose={() => setVisible(prev => ({...prev, image: false}))}
        >
            <Pressable
                onPress={() => setVisible(prev => ({...prev, image: false}))}
                className="flex-1 justify-center items-center bg-black/70 rounded-lg"
            >
                <Image
                    source={{ uri: imageUri }}
                    className="w-[95%] h-[95%]"
                    resizeMode="contain"
                />
            </Pressable>
        </Modal>
    )
}