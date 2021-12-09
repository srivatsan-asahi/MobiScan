import React, { Component, useEffect, useRef, useState } from 'react';
import {
    Text, View, Pressable, StyleSheet, PermissionsAndroid,
    Alert, FlatList, ScrollView, Image, SafeAreaView, TouchableOpacity
} from 'react-native';
import { CameraIcon, GalleryIcon } from '../assets/icons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob'
import { useIsFocused } from '@react-navigation/native';


const HomeScreen = (props) => {

    const { navigation, route } = props;
    const [imageList, setimageList] = useState([])
    const isFocused = useIsFocused();

    useEffect(() => {
        RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DCIMDir).then((files) => {
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
            path: data ? data.uri : data,
            width: 400,
            height: 400,
            freeStyleCropEnabled: true
        }).then(async (image) => {
            image['uri'] = image['path'];

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

    useEffect(() => {
        requestCameraPermission().then((res) => {
            console.log(res)
        }).catch((e) => {
            console.log(e)
        })
    }, [])

    // Take the Picture

    const openCamera = async () => {
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
                // await props.setImage(imageObj)
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
                // props.setImage(imageObj)
                cropLast(imageObj)
            }
        })
    }



    const onPressCamera = async () => {
        openCamera()

    }
    const onPressGallery = () => {
        openImageGallery();
    }


    //  Crop the Data

    const navigateFilter = (uri) => {
        navigation.navigate('FilterScreen', { value: uri })
    }
    let findLegnth = imageList?.length % 2 == 0

    return (

        <View style={styles.container}>
            <ScrollView>
                {
                    imageList?.length > 0 ?
                        <FlatList
                            numColumns={2}
                            columnWrapperStyle={{
                                flex: 1,
                                justifyContent: "space-around"
                            }}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={imageList}
                            keyExtractor={item => item}
                            renderItem={(item) => {
                                let value = 'file://' + RNFetchBlob.fs.dirs.DCIMDir + '/' + item.item
                                return (

                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('ImageshareScreen', { currentUri: value })
                                    }} style={{
                                        width: '45%',
                                        height: 150,
                                        margin: 10,
                                        padding: 5,
                                        borderRadius: 15,
                                        backgroundColor: '#FFFFFF',
                                        borderWidth: 1,
                                    }} key={value}>
                                        <Image
                                            style={{
                                                width: '100%',
                                                height: '70%',
                                                borderWidth: 1
                                            }}
                                            source={{ uri: value }}
                                        />
                                    </TouchableOpacity>
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

export default HomeScreen;