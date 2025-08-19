import CheckboxIconSvg from '../../assets/icons/CheckboxIcon';

const aspectRatio = 24 / 24

export const CheckboxIcon = ({width = 24}) => {
    return <CheckboxIconSvg width={width} height={width/aspectRatio} />
}