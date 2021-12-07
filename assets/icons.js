import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/Entypo';
import EditIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ArrowIcon from 'react-native-vector-icons/AntDesign'
export const CameraIcon = () => <Icon name="camera" size={30} color="#900" />

export const GalleryIcon = () => <Icon name="folder-images" size={30} color="#900" />

export const CropIcon = () => <Icon name="crop" size={30} color="#900" />

export const ImageEdit = () => <EditIcon name="image-edit" size={30} color="#900" />

export const ShareIcon = () => <Icon name="share" size={30} color="#900" />

export const CloseIcon = () => <EditIcon name="close-circle" size={25} color="#900" />

export const SaveIcon = () => <Icon name="save" size={30} color="#900" />

export const ImageSaved = () => <Icon name="folder-images" size={35} color="#900" />

export const BackArrowIcon = () => <ArrowIcon name="arrowleft" size={25} />

export default {
    CameraIcon,
    ShareIcon,
    GalleryIcon,
    CropIcon,
    CloseIcon,
    ImageEdit,
    SaveIcon,
    ImageSaved,
    BackArrowIcon
}

