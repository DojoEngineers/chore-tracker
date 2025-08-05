import HomeIconSvg from '../../assets/icons/HomeIconSvg';

const aspectRatio = 22 / 23

export const HomeIcon = ({width = 22}) => {
    return <HomeIconSvg width={width} height={width/aspectRatio} />
}