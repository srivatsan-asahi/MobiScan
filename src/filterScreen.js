
import React, { useState, useEffect, useCallback, useRef } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Modal,
    Button,
    Alert,
    Dimensions,
    Pressable,
    TouchableOpacity,
} from 'react-native';



import filters from '../assets/filters';
// Image Converting and Sharing  Packages
import ImagePicker from 'react-native-image-crop-picker';
import { BackArrowIcon, CloseIcon, SaveIcon, ShareIcon } from '../assets/icons';
import CameraRoll from '@react-native-community/cameraroll';

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


const FilterScreen = (props) => {

    const { route, navigation, setImage } = props;
    // URI 
    let uri = useRef(route.params.value.uri);
    const [selectedFilterIndex, setIndex] = useState();
    const [imageuri, seteditedImageUri] = useState(route.params.value.uri);
    console.log(filters.FILTERS)

    let filterNameArray = Object.keys(filters.FILTERS)
    console.log(filterNameArray)
    console.log(imageuri)

    // let pdfuri = uri.current.split('file://').pop().toString()


    // CropData
    function cropLast(data) {
        if (!data) {
            return Alert.alert(
                'No image',
                'Before open cropping only, please select image'
            );
        }
        ImagePicker.openCropper({
            path: data,
            width: 400,
            height: 400,
            freeStyleCropEnabled: true
        }).then(async (image) => {
            seteditedImageUri(image['path']) //Local State
        }).catch((e) => {
            if (e.code == 'E_PICKER_CANCELLED') {
                navigation.navigate("Home")
            } else {
                console.log(e)
            }
        });
    };

    const onSelectFilter = (value) => {
        let obj = filters.FILTERS

        let concatValue = obj[value]
        setIndex(concatValue);
    };


    // Filter List

    const renderFilterComponent = ({ item }) => {
        console.log(item)
        let obj = filters.FILTERS
        let value = obj[item]
        const filterimage = <ColorMatrix
            style={{
                width: 60,
                height: 60,
                borderWidth: 1
            }}
            matrix={concatColorMatrices(value)}
            onExtractImage={onExtractImage}
            extractImageEnabled={true}
            resizeMode={'contain'}
            image={
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: imageuri }}
                    resizeMode={'contain'}
                />
            }
        />
        return (
            <TouchableOpacity style={{ justifyContent: 'space-around', marginHorizontal: 10 }} onPress={() =>
                onSelectFilter(item)
            }>
                <Text >{item}</Text>
                {filterimage}
            </TouchableOpacity>
        );
    };

    const onExtractImage = ({ nativeEvent }) => {
        uri.current = nativeEvent.uri
    };



    //  Header save Option
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                    let savedUri = uri?.current
                    CameraRoll.saveToCameraRoll(savedUri)
                        .then(() => {
                            navigation.navigate('ShareScreen', { value: uri })
                        })
                        .catch(err => console.log('err:', err))

                }}>
                    <SaveIcon />
                </Pressable>
            ),
            headerLeft: () => (
                <Pressable style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20, marginTop: 2, alignSelf: 'center' }} onPress={() => {
                    let savedUri = uri?.current
                    cropLast(savedUri)
                }}>
                    <BackArrowIcon />
                </Pressable>
            ),
        });
    }, [navigation]);




    return (
        <View style={styles.container}>


            <ColorMatrix
                style={{
                    width: '95%',
                    height: '85%',
                    marginTop: '2%',

                }}
                matrix={concatColorMatrices(selectedFilterIndex ? selectedFilterIndex : filters.FILTERS.Normal)}
                onExtractImage={onExtractImage}
                extractImageEnabled={true}
                resizeMode={'contain'}
                image={
                    <Image
                        style={styles.image}
                        source={{ uri: imageuri }}
                        resizeMode={'contain'}
                    />
                }
            />

            <FlatList
                data={filterNameArray}
                renderItem={renderFilterComponent}
                keyExtractor={item => item}
                horizontal={true}
            />
        </View>
    )
};


export default FilterScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    filterlistView: {
        justifyContent: 'space-around',
        margin: 10,
        width: 20,
        height: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        marginVertical: '20%',
        marginHorizontal: 30,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    image: {
        width: '100%',
        height: 520,
        marginVertical: 10,
        alignSelf: 'center',
    },

});