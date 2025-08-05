import ApproveIconSvg from '../../assets/icons/ApproveIcon';

const aspectRatio = 24 / 23

export const ApproveIcon = ({width = 24}) => {
    return <ApproveIconSvg width={width} height={width/aspectRatio} />
}