import { View, Text } from 'react-native'
import React from 'react'

import { styles } from './styles';

export type ClassificationProps = {
  probability: number;
  className: string;
}

type Props = {
  data: ClassificationProps;
}

const Classification = ({ data: {
  probability,
  className
} }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.probability}>{probability.toFixed(4)}</Text>
      <Text style={styles.className}>
        {className}
      </Text>
    </View>
  )
}

export default Classification