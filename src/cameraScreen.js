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

import { Emboss, Grayscale } from 'react-native-image-filter-kit';
import { CAPTUREDIMAGE } from './redux/action';

const CameraScreen = (props) => {

    const { capturedImageUri } = props
    const [nativeUri, setnativeUri] = useState('')
    function cropLast() {
        if (!capturedImageUri.uri) {
            return Alert.alert(
                'No image',
                'Before open cropping only, please select image'
            );
        }

        ImagePicker.openCropper({
            path: nativeUri,
            width: 200,
            height: 200,
        })
            .then((image) => {
                console.log('received cropped image', image);
            })
            .catch((e) => {
                console.log(e);
            });
    }


    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>

            <Grayscale
                style={{ width: '50%', height: '50%', justifyContent: 'center', alignItems: 'center' }}
                extractImageEnabled={true}
                onExtractImage={({ nativeEvent }) => {
                    setnativeUri(nativeEvent.uri)
                }
                }
                image={
                    <Image
                        style={{ width: '80%', height: '80%' }}
                        source={{ uri: capturedImageUri.uri }}
                        resizeMode={'contain'}
                    />
                }
            />

            <View>
                <Pressable onPress={cropLast}>
                    <Text style={{ fontSize: 10, color: "black" }}>crop</Text>
                </Pressable>
                <Pressable onPress={() => console.log('filterScreen')}>
                    <Text>Grey</Text>
                </Pressable>
            </View>


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

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);

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