import LogoutIconSvg from '../../assets/icons/LogoutIcon';

const aspectRatio = 24 / 24

export const LogoutIcon = ({width = 24}) => {
    return <LogoutIconSvg width={width} height={width/aspectRatio} />
}