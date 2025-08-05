import PlusIconSvg from '../../assets/icons/PlusIconSvg';

const aspectRatio = 22 / 22

export const PlusIcon = ({width = 22}) => {
    return <PlusIconSvg width={width} height={width/aspectRatio} />
}