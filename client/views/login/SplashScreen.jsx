import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { LogoBottomSquiggle } from "../../components/squiggles/LogoBottomSquiggle";
import { LogoTopSquiggle } from "../../components/squiggles/LogoTopSquiggle";
import { AppLogo } from "../../components/icons/AppLogo";
import { pingServer } from "../../services/ping.service";
import Toast from "react-native-toast-message";
import { BrandBoldText } from "../../components/text/BrandBoldText";

export const SplashScreen = () => {

    const [apiErrors, setApiErrors] = useState("")
    const [serverLoading, setServerLoading] = useState(false)
    const [timerDone, setTimerDone] = useState(false)

    const navigation = useNavigation()

    useEffect(() => {
        let serverResolved = false
        
        const loadingTimer = setTimeout(() => {
            if (!serverResolved) {
                setServerLoading(true)
            }
        }, 300)

        pingServer()
            .then(res => {
                serverResolved = true
                setServerLoading(false)
            })
            .catch(error => {
                serverResolved = true
                console.log("pingServer error", error)
                Toast.show({ type: 'error', text1: "Unable to load server."})
                setApiErrors("Unable to load server.")
                setServerLoading(false)
            })

        const timer = setTimeout(() => {
            setTimerDone(true)
        }, 2000)

        return () => {
            clearTimeout(timer)
            clearTimeout(loadingTimer)
        }
    }, [])

    useEffect(() => {
        if (timerDone && !serverLoading && !apiErrors) {
            navigation.replace('StartingPage', { animationType: "fade" })
        }
    }, [timerDone, serverLoading, apiErrors])

    return (
        <View className="flex-1 justify-between bg-lightBg dark:bg-darkBg">
            <LogoTopSquiggle/>

            <View className="items-center px-[16px]">
                <AppLogo />

                {apiErrors && 
                    <BrandText className="text-red-500 text-center">
                        {apiErrors}
                    </BrandText>
                }

                {!apiErrors && serverLoading &&
                    <View>
                        <BrandBoldText
                            className="text-[15px] text-center text-lightPrimaryText dark:text-darkPrimaryText mb-6"
                        >
                            Server loading... Please wait 40-60 seconds.
                        </BrandBoldText>
                        <ActivityIndicator size="large" />
                    </View>
                }
            </View>

            <View className="items-end">
                <LogoBottomSquiggle/>
            </View>

        </View>
    )
}