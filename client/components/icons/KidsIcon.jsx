import KidsIconSvg from '../../assets/icons/KidsIconSvg';

const aspectRatio = 18 / 23

export const KidsIcon = ({width = 18}) => {
    return <KidsIconSvg width={width} height={width/aspectRatio} />
}