import { Dimensions, PixelRatio } from 'react-native';

const { height, width } = Dimensions.get('window');

const baseHeight = 1080;
const baseWidth = 1920;

export const verticalScale = (size) => {
    (height / baseHeight) * size;
};
export const horizontalScale = (size) => {
    (width / baseWidth) * size;
};
export const fontScale = (size) => {
    ((width / baseWidth) * size) / PixelRatio.getFontScale();
};
