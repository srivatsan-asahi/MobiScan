import React, { Component } from 'react';

import {
    Grayscale,
    Sepia,
    Tint,
    ColorMatrix,
    concatColorMatrices,
    invert,
    normal,
    contrast,
    saturate,
} from 'react-native-color-matrix-image-filters';

export const normalfilter = [normal(1)]

export const negativefilter = [saturate(1), contrast(1), invert(1)];

export const greyScale = [saturate(1.5), contrast(1.5), invert(0)];


export default {
    normalfilter,
    negativefilter,
    greyScale
}
