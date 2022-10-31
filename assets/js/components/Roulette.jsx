import React from "react";
import { Wheel } from "react-custom-roulette";

export default (props) => (
  <>
    <Wheel
      mustStartSpinning={props.mustSpin}
      prizeNumber={props.prizeNumber}
      data={props.data}
      backgroundColors={props.backgroundColors}
      textColors={props.textColors}
      fontSize={props.fontSize}
      outerBorderColor={props.outerBorderColor}
      outerBorderWidth={props.outerBorderWidth}
      innerRadius={props.innerRadius}
      innerBorderColor={props.innerBorderColor}
      innerBorderWidth={props.innerBorderWidth}
      radiusLineColor={props.radiusLineColor}
      radiusLineWidth={props.radiusLineWidth}
      textDistance={props.textDistance}
    />
  </>
);
