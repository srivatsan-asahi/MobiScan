// React Native Camera
// https://aboutreact.com/react-native-camera/

// import React in our code
import React, { useState, useEffect } from 'react';

// import all the components we are going to use
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    PermissionsAndroid,
    Alert,
    Platform,
    TouchableHighlight,
    Pressable,
} from 'react-native';

import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

import { CAPTUREDIMAGE } from './redux/action';
import { CropIcon, ImageEdit } from '../assets/icons';
import {
    Grayscale,
    Sepia,
    Tint,
    ColorMatrix,
    concatColorMatrices,
    invert,
    contrast,
    saturate,
} from 'react-native-color-matrix-image-filters';



const FilterScreen = (props) => {
    const { capturedImageUri, route } = props;

    let uri = route.params.value.uri;



    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

            <ColorMatrix
                style={{ width: '90%', height: '90%', justifyContent: 'center', alignItems: 'center' }}
                matrix={concatColorMatrices([saturate(1), contrast(1), invert(1)])}
            // alt: matrix={[saturate(-0.9), contrast(5.2), invert()]}
            >

                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: uri }}
                    resizeMode={'contain'}
                />

            </ColorMatrix>
        </View>
    )
};

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

export default connect(mapStateToProps, mapDispatchToProps)(FilterScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    textStyle: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        marginTop: 16,
    },
    buttonStyle: {
        fontSize: 16,
        color: 'white',
        backgroundColor: 'green',
        padding: 5,
        marginTop: 32,
        minWidth: 250,
    },
    buttonTextStyle: {
        padding: 5,
        color: 'white',
        textAlign: 'center',
    },
});