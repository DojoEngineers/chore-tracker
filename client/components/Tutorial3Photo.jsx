import Tutorial3PhotoSvg from '../assets/Tutorial3Photo';

const aspectRatio = 360 / 314

export const Tutorial3Photo = ({width = 360}) => {
    return <Tutorial3PhotoSvg width={width} height={width/aspectRatio} />
}