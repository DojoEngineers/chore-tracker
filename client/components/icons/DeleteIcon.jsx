import DeleteIconSvg from '../../assets/icons/DeleteIcon';

const aspectRatio = 24 / 26

export const DeleteIcon = ({width = 24}) => {
    return <DeleteIconSvg width={width} height={width/aspectRatio} />
}