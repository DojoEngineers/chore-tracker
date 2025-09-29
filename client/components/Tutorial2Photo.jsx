import Tutorial2ParentPhoto from '../assets/Tutorial2ParentPhoto';
import { useLogin } from '../context/UserContext';
import Tutorial2KidPhoto from '../assets/Tutorial2KidPhoto'

const parentAspectRatio = 360 / 315
const kidAspectRatio = 360 /312

export const Tutorial2Photo = ({width = 360}) => {

    const {loggedInData} = useLogin()

    return (
        loggedInData.isParent
            ? <Tutorial2ParentPhoto width={width} height={width/parentAspectRatio} />

            : <Tutorial2KidPhoto width={width} height={width/kidAspectRatio} />
    )
}