import Tutorial2PhotoSvg from '../assets/Tutorial2Photo';

const aspectRatio = 360 / 315

export const Tutorial2Photo = ({width = 360}) => {
    return <Tutorial2PhotoSvg width={width} height={width/aspectRatio} />
}