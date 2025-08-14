import Tutorial1PhotoSvg from '../assets/Tutorial1Photo';

const aspectRatio = 360 / 314

export const Tutorial1Photo = ({width = 360}) => {
    return <Tutorial1PhotoSvg width={width} height={width/aspectRatio} />
}