import { View } from "react-native"
import { Header } from "../../components/Header"
import { ParentNavBar } from "../../components/ParentNavBar"
import { BrandBoldText } from "../../components/text/BrandBoldText"

export const ParentDashboard = () => {

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">
            <View>
                <Header />
                <BrandBoldText
                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[32px] px-[16px]"
                >
                    Dashboard
                </BrandBoldText>
            </View>
            <ParentNavBar />
        </View>
    )
}