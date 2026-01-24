import { Text, TextStyle } from 'react-native';

import { colors } from '@/constants/theme';
import { TypoProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import React from 'react';

export default function Typo({
    size = 16,
    color = colors.text,
    fontWeight = "400",
    children,
    style,
    textProps = {}
}: TypoProps) {

    const textstyle: TextStyle = {
        fontSize: verticalScale(size),
        color,
        fontWeight
    }


    return (

        <Text style={[textstyle, style]} {...textProps}>
            {children}
        </Text>

    )
}