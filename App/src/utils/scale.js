import { Dimensions, PixelRatio } from 'react-native';

const { height, width } = Dimensions.get('window');
console.log(height, width);

const baseHeight = 800;
const baseWidth = 360;

export const verticalScale = (size) => (height / baseHeight) * size;

export const horizontalScale = (size) => (width / baseWidth) * size;

export const fontScale = (size) =>
    ((width / baseWidth) * size) / PixelRatio.getFontScale();
