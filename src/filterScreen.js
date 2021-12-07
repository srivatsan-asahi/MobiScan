
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

// Redux Packages
import { connect } from 'react-redux';
import { CAPTUREDIMAGE } from './redux/action';

import filters from '../assets/filters';
// Image Converting and Sharing  Packages

import { BackArrowIcon, CloseIcon, SaveIcon, ShareIcon } from '../assets/icons';
import CameraRoll from '@react-native-community/cameraroll'

const FilterScreen = (props) => {

    const { capturedImageUri, route, navigation } = props;
    const [selectedFilterIndex, setIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    // URI 
    console.log(route.params.value.uri)
    let uri = useRef(route.params.value.uri);
    // let pdfuri = uri.current.split('file://').pop().toString()


    // Filter List

    const renderFilterComponent = ({ item, index }) => {
        const FilterComponent = item.filterComponent;
        const image = (
            <Image
                style={{ width: '100%', height: '100%' }}
                source={{ uri: uri.current }}
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
        console.log(nativeEvent.uri)
        uri.current = nativeEvent.uri;
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
                    console.log("hello worl")
                    navigation.navigate('ShareScreen', { uri: uri })
                }}>
                    <SaveIcon />
                </Pressable>
            ),
            headerLeft: () => (
                <Pressable style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20, marginTop: 2, alignSelf: 'center' }} onPress={() => {
                    navigation.navigate('Home')
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
                    source={{ uri: uri.current }}
                    resizeMode={'contain'}
                />
            ) : (
                <SelectedFilterComponent
                    onExtractImage={onExtractImage}
                    extractImageEnabled={true}
                    image={
                        <Image
                            style={styles.image}
                            source={{ uri: uri.current }}
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