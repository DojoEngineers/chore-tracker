import TodayIconSvg from '../../assets/icons/TodayIconSvg';

const aspectRatio = 22 / 24

export const TodayIcon = ({width = 22}) => {
    return <TodayIconSvg width={width} height={width/aspectRatio} />
}