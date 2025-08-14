import Frame1IconSvg from '../../assets/icons/Frame1Icon';

const aspectRatio = 59 / 13

export const Frame1Icon = ({width = 59}) => {
    return <Frame1IconSvg width={width} height={width/aspectRatio} />
}