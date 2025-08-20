import LightWriteIcon from '../../assets/icons/LightWriteIcon';

const aspectRatio = 19 / 19

export const WriteIcon= ({width = 19}) => {
    return <LightWriteIcon width={width} height={width/aspectRatio} />
}