import React from "react";
import "../../styles/frame.css";

export const Frame = () => {
  return (
    <div className="frame">
      <div className="calendar-events">
        <img className="divider" alt="Divider" src="divider.svg" />
        <div className="text-wrapper">DSI</div>
        <div className="weekdays">
          <div className="div">AM</div>
          <div className="text-wrapper-2">PM</div>
        </div>
        <div className="event">
          <div className="text-wrapper-3">Florian.R</div>
          <div className="ABS-DI">ABS&nbsp;&nbsp; |&nbsp;&nbsp;&nbsp;&nbsp;DI</div>
        </div>
        <div className="event">
          <div className="text-wrapper-3">Loïc.D</div>
          <div className="DI-DI">DI&nbsp;&nbsp;&nbsp;&nbsp; |&nbsp;&nbsp;&nbsp;&nbsp;DI</div>
        </div>
        <div className="event">
          <div className="text-wrapper-3">Vincent.D</div>
          <div className="ABS-ABS">ABS&nbsp;&nbsp; |&nbsp;&nbsp;ABS</div>
        </div>
      </div>
      <img className="arrows" alt="Arrows" src="arrows.svg" />
    </div>
  );
};