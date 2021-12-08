
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

import Share from 'react-native-share';
import RNImageToPdf from 'react-native-image-to-pdf';
import RNFetchBlob from 'react-native-fetch-blob';
import { BackArrowIcon, ImageSaved } from '../assets/icons';




const ShareScreen = (props) => {
    const { capturedImageUri, route, navigation } = props;

    // URI
    let uri = route.params.uri.current
    console.log(uri)
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
                url: uri
            }
        ).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        });
    };
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Pressable style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20, marginTop: 2 }} onPress={() => {
                    navigation.navigate('Home')
                }}>
                    <BackArrowIcon />
                </Pressable>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View>
                {
                    uri ?
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <ImageSaved />
                            <Text style={{ fontSize: 25 }}>Image Saved SuccesFully !!</Text>
                        </View>

                        :
                        null
                }
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ margin: 10 }}>
                    <Text>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ margin: 10 }} onPress={ShareAsImage}>
                    <Text>ShareAsImage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ margin: 10 }} onPress={myAsyncPDFFunction}>
                    <Text>ShareAsPdf</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

export default ShareScreen;

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