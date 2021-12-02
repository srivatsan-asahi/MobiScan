// React Native Camera
// https://aboutreact.com/react-native-camera/

// import React in our code
import React, { useState, useEffect, useCallback } from 'react';

// import all the components we are going to use
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    PermissionsAndroid,
    FlatList,
    Platform,
    TouchableHighlight,
    Pressable,
} from 'react-native';

import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

import { CAPTUREDIMAGE } from './redux/action';
import { CropIcon, ImageEdit } from '../assets/icons';
import {
    ColorMatrix,
    concatColorMatrices
} from 'react-native-color-matrix-image-filters';
import { negativefilter, normalfilter, greyScale } from '../assets/filters';




const FilterScreen = (props) => {
    const { capturedImageUri, route } = props;

    const [filterType, setfiltertype] = useState(normalfilter)

    let uri = route.params.value.uri;

    let filterdata = [
        {
            id: 1,
            filterOption: normalfilter,
            filterName: 'Normal',
            hexCode: '#808080'
        }
        ,
        {
            id: 2,
            filterOption: negativefilter,
            filterName: 'Negative',
            hexCode: '#808080'
        }
        ,
        {
            id: 3,
            filterOption: greyScale,
            filterName: 'GreyScale',
            hexCode: '#808080'
        }
    ];

    const renderItem = useCallback(({ item }) => {
        return (

            <Pressable onPress={() => {

                setfiltertype(item.filterOption)
            }}>
                <View style={[styles.filterlistView, { backgroundColor: item.hexCode }]} >
                    <Text>{item.filterName}</Text>
                </View>
            </Pressable>

        );
    }, []);

    const keyExtractor = useCallback((item) => {
        return item.id;
    }, []);




    return (
        <View style={styles.container}>
            <Pressable>
                <Text>Share</Text>
            </Pressable>
            <ColorMatrix
                style={{ width: '90%', height: '90%', justifyContent: 'center', alignItems: 'center' }}
                matrix={concatColorMatrices([filterType])}
            >

                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: uri }}
                    resizeMode={'contain'}
                />

            </ColorMatrix>
            <FlatList
                data={filterdata}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal={true}
            />

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
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    filterlistView: {
        justifyContent: 'space-around',
        margin: 10,
        width: 20,
        height: 20,
    }

});