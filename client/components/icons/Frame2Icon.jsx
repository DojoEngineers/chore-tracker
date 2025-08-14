import Frame2IconSvg from '../../assets/icons/Frame2Icon';

const aspectRatio = 59 / 13

export const Frame2Icon = ({width = 59}) => {
    return <Frame2IconSvg width={width} height={width/aspectRatio} />
}