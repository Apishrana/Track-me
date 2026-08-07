import { Dimensions, PixelRatio } from 'react-native';

const { height, width } = Dimensions.get('window');

const baseHeight = 0;
const baseWidth = 0;

export const verticalScale = (size) => {
    (height / baseHeight) * size;
};
export const horizontalScale = (size) => {
    (width / baseWidth) * size;
};
export const fontScale = (size) => {
    ((width / baseWidth) * size) / PixelRatio.getFontScale();
};
