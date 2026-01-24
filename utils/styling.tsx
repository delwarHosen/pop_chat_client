import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const [shortDimention, longDimention] = SCREEN_WIDTH < SCREEN_HEIGHT ? [SCREEN_WIDTH, SCREEN_HEIGHT] : [SCREEN_HEIGHT, SCREEN_WIDTH];

const guidLinesBaseWidth = 375;
const guidLinesBaseHeight = 812;


export const scale = (size: number): number => {
    return Math.round(
        PixelRatio.roundToNearestPixel(
            (shortDimention / guidLinesBaseWidth) * size
        )
    );
}

export const verticalScale = (size: number): number => {
    return Math.round(
        PixelRatio.roundToNearestPixel(
            (longDimention / guidLinesBaseHeight) * size
        )
    );
}
