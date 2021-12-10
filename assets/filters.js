import React, { Component } from 'react';

import {
    AdenCompat,
    _1977Compat,
    Grayscale,
    ColorMatrix,
    concatColorMatrices,
    invert,
    contrast,
    saturate,
} from 'react-native-image-filter-kit';


const FILTERS = {
    'Normal': [saturate(1)],
    'GrayScale': [[
        0.3, 0.59, 0.11, 0, 0,
        0.3, 0.59, 0.11, 0, 0,
        0.3, 0.59, 0.11, 0, 0,
        0, 0, 0, 1, 0]],
    'GreenScale': [saturate(1), contrast(12), invert(12)],
    'Normal1': [saturate(1)],
    'GrayScale2': [[
        0.3, 0.59, 0.11, 0, 0,
        0.3, 0.59, 0.11, 0, 0,
        0.3, 0.59, 0.11, 0, 0,
        0, 0, 0, 1, 0]],
    'GreenScale3': [saturate(1), contrast(12), invert(12)]
}

export default {
    FILTERS
}
