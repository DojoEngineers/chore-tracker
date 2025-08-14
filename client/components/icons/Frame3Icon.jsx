import Frame3IconSvg from '../../assets/icons/Frame3Icon';

const aspectRatio = 59 / 13

export const Frame3Icon = ({width = 59}) => {
    return <Frame3IconSvg width={width} height={width/aspectRatio} />
}