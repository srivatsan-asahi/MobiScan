
import React, { useState, useEffect, useCallback } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Dimensions,
    Pressable,
    TouchableOpacity,
} from 'react-native';

// Redux Packages
import { connect } from 'react-redux';
import { CAPTUREDIMAGE } from './redux/action';

// Image filter Packages
import {
    ColorMatrix,
    concatColorMatrices
} from 'react-native-color-matrix-image-filters';
import { negativefilter, normalfilter, greyScale } from '../assets/filters';

// Image Converting and Sharing  Packages
import Share from 'react-native-share';
import RNImageToPdf from 'react-native-image-to-pdf';
import RNFetchBlob from 'react-native-fetch-blob';


const FilterScreen = (props) => {

    const { capturedImageUri, route } = props;


    const [filterType, setfiltertype] = useState(normalfilter);
    const [shareOption, setShareOption] = useState(false)
    //    FilterList 
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

    // URI 
    let uri = route.params.value.uri;
    let pdfuri = uri.split('file://').pop().toString()
    // Device Width and Height
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;

    // PDF conversion functionality
    function sharePDFWithAndroid(fileUrl, type) {
        const base64Data = async (data) => {
            const base64Data = ('data:application/pdf;base64,') + data
            await Share.open({ url: base64Data }).then((err) => {
                console.log(err)
            })
        }

        RNFetchBlob.fs.readFile(fileUrl, 'base64')
            .then(async (data) => {
                await base64Data(data)

            }).catch((err) => {
                console.log(err)
            });
    }

    const myAsyncPDFFunction = async () => {
        try {
            const options = {
                imagePaths: [pdfuri],
                // to convert Bin to pdf file this naming is needed
                name: 'PDFName.pdf',
                maxSize: { // optional maximum image dimension - larger images will be resized
                    width: 900,
                    height: Math.round(deviceHeight / deviceWidth * 900),
                },
                quality: .7, // optional compression paramter
                targetPathRN: "/storage/emulated/0/Download/", // only for android version 9 and lower
                //for versions higher than 9 it is stored in (Download/img-to-pdf/)
            };
            const pdf = await RNImageToPdf.createPDFbyImages(options);
            sharePDFWithAndroid(pdf.filePath)

        } catch (e) {
            console.log(e);
        }
    }

    const ShareAsImage = async () => {


        const shareOption = await Share.open(
            {
                url: route.params.value.uri
            }
        ).then((res) => {

            console.log(res)
        }).catch((err) => {
            console.log(err)
        });





    };

    // Filter List

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
            <TouchableOpacity onPress={ShareAsImage}>
                <Text>ShareAsImage</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={myAsyncPDFFunction}>
                <Text>ShareAsPdf</Text>
            </TouchableOpacity>
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