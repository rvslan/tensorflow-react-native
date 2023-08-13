import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React from 'react';
import { styles } from './styles';

type Props = TouchableOpacityProps & {
  title: string;
};

const Button = ({ title, ...rest }: Props) => {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
    <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
