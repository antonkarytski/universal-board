import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

export type ButtonProps = {
  label: string;
} & TouchableOpacityProps;

export default function Button({ label, ...props }: ButtonProps) {
  return (
    <TouchableOpacity {...props}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}
