import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import Voice from 'react-native-voice';
import Video from 'react-native-video';
// import videos from './data';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import action from './store/action';

import {useSelector, useDispatch} from 'react-redux';

export default function Child() {
  const dispatch = useDispatch();
  const videosData = useSelector((state) => state.videos.video);
  console.log(videosData);

  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);

  // console.log(videoData);

  useEffect(() => {
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onScroll = (e) => {
    for (let e = 0; e < videosData.length - 1; e++) {
      setInterval(() => videosData.scrollToIndex({index: e}), 5000);
    }
  };
  const onSpeechStart = (e) => {
    //Invoked when .start() is called without error
    console.log('onSpeechStart: ', e);
    setStarted('√');
  };

  const onSpeechEnd = (e) => {
    //Invoked when SpeechRecognizer stops recognition
    console.log('onSpeechEnd: ', e);
    setEnd('√');
  };

  const onSpeechError = (e) => {
    //Invoked when an error occurs.
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
  };

  const onSpeechResults = (e) => {
    //Invoked when SpeechRecognizer is finished recognizing
    console.log('onSpeechResults: ', e.value[0]);

    let vResult = e.value[0];
    let small = vResult.toLowerCase();

    setResults([small]);

    setShowModal(false);
    dispatch({type: 'PULL_VIDEOS', data: small});

    // for (let i = 0; i < videoData.length - 1; i++) {
    //   let newArray = [...videos];
    //   if (small == newArray[i].name) {
    //     newArray.splice(0, 0, newArray[i]);

    //     const mainArray = newArray.filter((item, index) => {
    //       if (item.name == small && index != 0) {
    //       } else {
    //         return item;
    //       }
    //     });

    //     setVideos(mainArray);
    //   }
    // }
  };

  const startRecognizing = async () => {
    console.log('start listenind');
    //Starts listening for speech for a specific locale
    try {
      await Voice.start('en-US');
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setEnd('');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };
  const stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}>
      <View
        style={{
          height: 70,
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 15,
          flexDirection: 'row',
          marginVertical: 15,
          marginTop: 25,
        }}>
        <View
          style={{
            height: 40,
            borderRadius: 20,
            width: 300,
            borderWidth: 1,
            borderColor: '#F23C29',
          }}>
          <TextInput
            placeholder="Search ..."
            style={{flex: 1, paddingHorizontal: 30, color: 'white'}}
            placeholderTextColor="grey"
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              startRecognizing();
              setShowModal(true);
            }}>
            <SimpleLineIcons color={'white'} name="microphone" size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: 'orange',
          borderWidth: 1,
        }}>
        <FlatList
          data={videosData}
          // ref={(ref) => (flatRef = ref)}
          showsVerticalScrollIndicator={true}
          // scrollToIndex={(e) => {
          //   console.log(e, 'is there something');
          //   for (e = 0; e < videoData.length - 1; e++) {
          //     setInterval((e) => videoData.scrollToIndex({index: e}), 1000);
          //   }
          //   console.log(e, 'render');
          // }}
          renderItem={({item, index}) => {
            return (
              <View
                key={index}
                style={{
                  height: 200,
                  marginVertical: 30,
                  marginBottom: 50,
                }}>
                <Video
                  source={{uri: item.source}}
                  muted={true}
                  resizeMode="cover"
                  paused={!paused}
                  style={{
                    width: '100%',
                    height: undefined,
                    aspectRatio: 2,
                  }}
                />
                <Text
                  style={{
                    fontSize: 20,
                    alignItems: 'center',
                    marginLeft: 20,
                    marginTop: 15,
                    color: 'white',
                  }}>
                  {item.title}
                </Text>
              </View>
            );
          }}
        />
      </SafeAreaView>

      <Modal
        visible={showModal}
        transparent={true}
        onRequestClose={() => {
          setShowModal(false);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.9)',
          }}>
          <MaterialCommunityIcons
            name="microphone-settings"
            size={45}
            color="white"
          />
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              marginTop: 20,
              fontSize: 17,
            }}>
            We are listening
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
