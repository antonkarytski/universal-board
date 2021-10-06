import React, { MutableRefObject } from "react";
import { PointsHistory } from "./hook.drawBoard";
import { useRepeaterBoard } from "./hook.repeaterBoard";
import { StyleProp, View, ViewStyle } from "react-native";
import Button from "../buttons/Button";
import PlayButton from "../buttons/PlayButton";
import Canvas from "../canvas/Canvas";

type RepeaterBoardProps = {
  history: MutableRefObject<PointsHistory>;
  style?: StyleProp<ViewStyle>;
};

export default function RepeaterBoard({ history, style }: RepeaterBoardProps) {
  const {
    canvasRef,
    stepBack,
    stepForward,
    togglePlaying,
    isPlaying,
  } = useRepeaterBoard(history);

  return (
    <View>
      <Canvas style={style} canvasRef={canvasRef} height={500} width={500} />
      <View>
        <Button label={"Step back"} onPress={stepBack} />
        <PlayButton isPressed={isPlaying} onPress={togglePlaying} />
        <Button label={"Step forward"} onPress={stepForward} />
      </View>
    </View>
  );
}
