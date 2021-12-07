import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/Entypo';
import EditIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export const CameraIcon = () => <Icon name="camera" size={30} color="#900" />

export const GalleryIcon = () => <Icon name="folder-images" size={30} color="#900" />

export const CropIcon = () => <Icon name="crop" size={30} color="#900" />

export const ImageEdit = () => <EditIcon name="image-edit" size={30} color="#900" />

export const ShareIcon = () => <Icon name="share" size={30} color="#900" />

export const CloseIcon = () => <EditIcon name="close-circle" size={25} color="#900" />

export default {
    CameraIcon,
    ShareIcon,
    GalleryIcon,
    CropIcon,
    CloseIcon,
    ImageEdit
}

