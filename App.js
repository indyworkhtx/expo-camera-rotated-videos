import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import { Video } from "expo-av";

export default CameraScreen = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoSource, setVideoSource] = useState();
  const cameraRef = useRef();

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };
  const onCameraReady = (test) => {
    console.log("READY", test);
    setIsCameraReady(true);
  };

  const renderCaptureControl = () => (
    <View style={styles.control}>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={!isCameraReady}
        onPress={!isVideoRecording ? recordVideo : stopVideoRecording}
        //onLongPress={recordVideo}
        //onPressOut={stopVideoRecording}
        //onPress={takePicture}
        style={[styles.capture, isVideoRecording && styles.recording]}
      />
    </View>
  );

  const renderVideoRecordIndicator = () => (
    <View style={styles.recordIndicatorContainer}>
      <View style={styles.recordDot} />
      <Text style={styles.recordTitle}>{"Recording..."}</Text>
    </View>
  );

  const renderVideoPlayer = () => (
    <Pressable
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      onPress={cancelPreview}
    >
      <Video
        source={{ uri: videoSource.uri }}
        shouldPlay={true}
        style={styles.media}
        onError={(error) => console.log("video err", error)}
      />
    </Pressable>
  );

  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        console.log("START");
        setIsVideoRecording(true);
        const data = await cameraRef.current.recordAsync({
          maxDuration: 15,
          //maxFileSize: 100000,
        });

        setVideoSource(data);
      } catch (error) {
        console.warn(error);
      } finally {
        setIsVideoRecording(false);
      }
    }
  };

  const stopVideoRecording = () => {
    try {
      if (cameraRef.current) {
        setIsVideoRecording(false);
        cameraRef.current.stopRecording();
      }
    } catch (err) {
      console.log("ERR", err);
    }
  };

  const cancelPreview = async () => {
    //await cameraRef.current.resumePreview();
    setVideoSource(null);
  };

  if (!permission) {
    requestPermission();
    return <View />;
  }
  return (
    <View style={styles.container}>
      {permission.granted === false ? (
        <Text style={styles.text}>No access to camera</Text>
      ) : (
        <>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            onCameraReady={onCameraReady}
            mute={true}
            mode="video"
            onMountError={(error) => {
              console.log("camera error", error);
            }}
            responsiveOrientationWhenOrientationLocked={true}
            onResponsiveOrientationChanged={Alert.alert("Orientation changed")}
          >
            {!videoSource && (
              <View style={styles.buttonContainer}>
                {isCameraReady && renderCaptureControl()}
                {isVideoRecording && renderVideoRecordIndicator()}
              </View>
            )}
            {videoSource && renderVideoPlayer()}
          </CameraView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  control: {
    position: "absolute",
    flexDirection: "row",
    bottom: 38,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  capture: {
    backgroundColor: "#f5f6f5",
    borderRadius: 5,
    height: 100,
    width: 100,
    borderRadius: Math.floor(100 / 2),
    marginHorizontal: 31,
  },
  recording: {
    backgroundColor: "red",
  },
  recordIndicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    opacity: 0.7,
  },
  recordTitle: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: "#ff0000",
    marginHorizontal: 5,
  },
  media: {
    width: "100%",
    height: "50%",
  },
});
