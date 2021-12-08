import React, { Component, useEffect, useRef, useState } from 'react';
import {
    Text, View, Pressable, StyleSheet, PermissionsAndroid,
    Alert, FlatList, ScrollView, Image, SafeAreaView
} from 'react-native';
import { CameraIcon, GalleryIcon } from '../assets/icons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { CAPTUREDIMAGE } from "./redux/action/index";
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob'
import { useIsFocused } from '@react-navigation/native';

const HomeScreen = (props) => {

    const { navigation, route } = props;
    const [imageList, setimageList] = useState([])
    const isFocused = useIsFocused();

    useEffect(() => {
        RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DCIMDir).then((files) => {
            console.log(files)
            let matchedArray = files.filter(value => /\.(jpe?g|png|bmp|pdf)$/i.test(value))
            setimageList(matchedArray)
        })
    }, [isFocused])

    // CropData
    function cropLast(data) {
        if (!data) {
            return Alert.alert(
                'No image',
                'Before open cropping only, please select image'
            );
        }
        ImagePicker.openCropper({
            path: data.uri ? data.uri : data,
            width: 400,
            height: 400,
            freeStyleCropEnabled: true
        }).then(async (image) => {
            image['uri'] = image['path'];
            await props.setImage(image);
            navigateFilter(image)

        }).catch((e) => {
            console.log(e);
        });

    };



    //  Ask Permission
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
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return console.log("hello")
            }
        } catch (err) {
            console.warn(err);
        }

    };

    // Take the Picture

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
                console.log(imageObj, "<=====imageObj")
                cropLast(imageObj)
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
                cropLast(imageObj)
                // await setImageView({ imageView: true, imageClicked: imageObj, orderID: orderID });
            }
        })
    }



    const onPressCamera = () => {
        requestCameraPermission()
        openCamera();

    }
    const onPressGallery = () => {
        openImageGallery();
    }


    //  Crop the Data

    const navigateFilter = (image) => {
        navigation.navigate('FilterScreen', { value: image })
    }




    //Image card





    return (

        <View style={styles.container}>
            <ScrollView>
                {
                    imageList?.length > 0 ?
                        <FlatList
                            contentContainerStyle={{ alignSelf: 'center', width: '90%', alignItems: 'center', justifyContent: 'center' }}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={imageList}
                            keyExtractor={item => item}
                            renderItem={(item) => {
                                let value = 'file://' + RNFetchBlob.fs.dirs.DCIMDir + '/' + item.item
                                return (
                                    <View style={{
                                        width: '45%',
                                        height: 200,
                                        margin: 10,
                                        padding: 5,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        borderRadius: 15,
                                        backgroundColor: '#FFFFFF',
                                        borderWidth: 1,
                                        overflow: 'hidden'
                                    }} key={value}>
                                        <Image
                                            style={{
                                                width: '100%',
                                                height: '70%', borderWidth: 1
                                            }}
                                            source={{ uri: value }}
                                        />
                                    </View>
                                )

                            }}
                        />
                        : null
                }

            </ScrollView>
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
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 10,
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center'

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