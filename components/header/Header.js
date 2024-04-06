import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from "react-native-vector-icons/MaterialIcons";

import defaultAvt from "../../assets/header/defaultAvt.png"
import { constants } from '../../constants/constants';
import { getRealTime } from '../../api/auth';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function Header({ goback, navigation, background, title }) {

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const loadTime = async () => {
            try {
                const response = await getRealTime();
                const parsedTime = new Date(response);
                const updatedTime = new Date(parsedTime.getTime() + 1000); // Adding one second
                setCurrentTime(updatedTime);
            } catch (error) {
                console.error('Error fetching time:', error);
            }
        };

        // Initial load
        loadTime();

        // Update time every second
        const intervalId = setInterval(() => {
            loadTime()
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: background ? background : constants.background }]}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                    goback ? goback() : navigation?.pop();
                }}
            >
                <Icon name={"arrow-back-ios"} color={"white"} size={28} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
            </Text>
            {/* {currentTime?.getHours()}:{currentTime?.getMinutes()} {currentTime?.getHours() > 12 ? "PM" : "AM"}  */}
            <Text style={styles.timeText}> {currentTime?.getDate()}/{currentTime?.getMonth() + 1}/{currentTime?.getFullYear() + 1}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: WIDTH,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        paddingTop: HEIGHT * 0.03
    },
    backButton: {
        position: "absolute",
        width: 70,
        height: 50,
        alignItems: "center",
        justifyContent: "flex-end",
        left: 0,
    },
    headerTitle: {
        width: "80%",
        paddingVertical: 10,
        color: "white",
        fontWeight: "600",
        fontSize: 18,
        textAlign: "center",
    },
    timeText: {
        position: "absolute",
        color: "white",
        bottom: "40%",
        right: 5
    }
});
