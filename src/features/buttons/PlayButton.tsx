import React from "react";
import Button, { ButtonProps } from "./Button";

type PlayButtonProps = {
  isPressed: boolean;
} & Omit<ButtonProps, "label">;

export default function PlayButton({
  isPressed,
  ...buttonProps
}: PlayButtonProps) {
  return <Button label={isPressed ? "Pause" : "Play"} {...buttonProps} />;
}
