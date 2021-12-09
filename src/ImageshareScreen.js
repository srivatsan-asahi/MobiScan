import React, { Component, useEffect, useRef, useState } from 'react';
import {
    Text, View, Pressable, StyleSheet, PermissionsAndroid,
    Alert, FlatList, ScrollView, Image, SafeAreaView, TouchableOpacity, Dimensions
} from 'react-native';
import Share from 'react-native-share';
import RNImageToPdf from 'react-native-image-to-pdf';
import RNFetchBlob from 'react-native-fetch-blob';

const ImageshareScreen = (props) => {
    const { route } = props;
    let uri = route.params?.currentUri
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    let pdfuri = uri?.split('file://').pop().toString()

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
    return (
        <View style={{ justifyContent: 'center' }}>
            <Image
                style={{
                    alignSelf: 'center',
                    width: '80%',
                    height: '85%',
                    borderWidth: 1
                }}
                source={{ uri: uri }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
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

export default ImageshareScreen;