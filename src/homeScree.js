import React, { Component, useRef } from 'react';
import {
    Text, View, Pressable, StyleSheet, PermissionsAndroid,
    Alert,
} from 'react-native';
import { CameraIcon, GalleryIcon } from '../assets/icons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { CAPTUREDIMAGE } from "../src/redux/action/index";
import { connect } from 'react-redux';


const HomeScreen = (props) => {
    const { navigation } = props
    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "App Camera Permission",
                    message: "App needs access to your camera ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) return
        } catch (err) {
            console.warn(err);
        }
    };

    const navigateEditing = () => {
        navigation.navigate('CameraEditing')
    }

    const openCamera = () => {
        const options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            quality: 0.7,
        };
        launchCamera(options, async response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const imageObj = response.assets[0];
                props.setImage(imageObj)
                navigateEditing();
                // await setImageView({ imageView: true, imageClicked: imageObj, orderID: orderID });
            }
        })
    };

    const openImageGallery = () => {
        const options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            quality: 0.7,
        };
        launchImageLibrary(options, async response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const imageObj = response.assets[0];
                props.setImage(imageObj)
                navigateEditing()
                // await setImageView({ imageView: true, imageClicked: imageObj, orderID: orderID });
            }
        })

    }



    const onPressCamera = () => {
        console.log("pressed camera")
        requestCameraPermission()
        openCamera();

    }
    const onPressGallery = () => {
        console.log("Pressed Gallery")
        openImageGallery();
    }

    return (
        <View style={styles.container}>
            <View>
                <Text>Icon</Text>
            </View>
            <View style={styles.pickerButton}>
                <Pressable style={styles.Icons} onPress={onPressCamera}>
                    <CameraIcon />
                </Pressable>
                <Pressable style={styles.Icons} onPress={onPressGallery}>
                    <GalleryIcon />
                </Pressable>
            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'black',
        borderRadius: 10
    },
    Icons: {
        padding: 10
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },



});
const mapStateToProps = state => {
    return {
        capturedImageUri: state.ImageReduce.capturedImage
    }

};

const mapDispatchToProps = dispatch => {

    return {
        setImage: (uri) => dispatch({ type: CAPTUREDIMAGE, payload: uri }),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);