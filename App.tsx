import { StatusBar } from 'expo-status-bar';
import { Image, View, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as FileSystem from 'expo-file-system';

import Button from './components/Button';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import Classification, { ClassificationProps } from './components/Classification';

export default function App() {
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationProps[]>([]);

  async function imageClassification(imageUri: string) {
    setResult([]);
    await tf.ready();
    const model = await mobilenet.load();

    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const imgBuffer = tf.util.encodeString(imageBase64, 'base64').buffer;

    const raw = new Uint8Array(imgBuffer);
    const imageTensor = decodeJpeg(raw);

    const classificationResult = await model.classify(imageTensor);

    setResult(classificationResult);
  }

  async function handleSelectImage() {
    setIsLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];

        setSelectedImageUri(uri);
        await imageClassification(uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style='light' backgroundColor='transparent' translucent />

      <Image
        source={{
          uri: selectedImageUri
            ? selectedImageUri
            : 'https://t3.ftcdn.net/jpg/03/45/05/92/360_F_345059232_CPieT8RIWOUk4JqBkkWkIETYAkmz2b75.jpg',
        }}
        style={styles.image}
      />

      <View style={styles.results}>
        {
          result.map((classification) => (
            <Classification key={classification.className} data={classification} />
          ))
        }
      </View>

      {isLoading ? <ActivityIndicator color='#5F1BBF' /> : <Button title='Select image' onPress={handleSelectImage} />}

    </View>
  );
}
