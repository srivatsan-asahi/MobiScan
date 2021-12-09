
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
import CameraRoll from '@react-native-community/cameraroll'

const FilterScreen = (props) => {

    const { route, navigation, setImage } = props;
    // URI 
    let uri = useRef(route.params.value.uri);
    const [selectedFilterIndex, setIndex] = useState(0);
    const [imageuri, seteditedImageUri] = useState(uri)

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
            // image['uri'] = image['path'];
            // await setImage({ current: image['path'] })
            seteditedImageUri({ current: image['path'] }) //Local State
        }).catch((e) => {
            if (e.code == 'E_PICKER_CANCELLED') {
                navigation.navigate("Home")
            } else {
                console.log(e)
            }
        });

    };



    // Filter List

    const renderFilterComponent = ({ item, index }) => {
        const FilterComponent = item.filterComponent;
        const image = (
            <Image
                style={{ width: '100%', height: '100%' }}
                source={{ uri: imageuri.current }}
                resizeMode={'contain'}
            />
        );

        return (
            <TouchableOpacity style={{ justifyContent: 'space-evenly' }} onPress={() => onSelectFilter(index)}>
                <FilterComponent image={image} />
                <Text >{item.title}</Text>
            </TouchableOpacity>
        );
    };

    const onExtractImage = ({ nativeEvent }) => {
        uri.current = nativeEvent.uri
    };

    const onSelectFilter = selectedIndex => {
        setIndex(selectedIndex);
    };

    const SelectedFilterComponent = filters.FILTERS[selectedFilterIndex].filterComponent;



    //  Header save Option
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                    let savedUri = imageuri?.current
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
                    let savedUri = imageuri?.current
                    cropLast(savedUri)
                }}>
                    <BackArrowIcon />
                </Pressable>
            ),
        });
    }, [navigation]);

    return (

        <View style={styles.container}>
            {selectedFilterIndex === 0 ? (
                <Image
                    style={styles.image}
                    source={{ uri: imageuri.current }}
                    resizeMode={'contain'}
                />
            ) : (
                <SelectedFilterComponent
                    onExtractImage={onExtractImage}
                    extractImageEnabled={true}
                    image={
                        <Image
                            style={styles.image}
                            source={{ uri: imageuri.current }}
                            resizeMode={'contain'}
                        />
                    }
                />
            )}

            <FlatList
                data={filters.FILTERS}
                renderItem={renderFilterComponent}
                keyExtractor={item => item.title}
                horizontal={true}
            />

        </View>
    )
};

const mapStateToProps = state => {
    console.log(state.ImageReduce.capturedImage, "<===Captuers")
    return {
        capturedImageUri: state.ImageReduce.capturedImage
    }

};
const mapDispatchToProps = dispatch => {

    return {
        setImage: (uri) => dispatch({ type: CAPTUREDIMAGE, payload: uri }),
    }
}

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
        width: 520,
        height: 520,
        marginVertical: 10,
        alignSelf: 'center',
    },

});