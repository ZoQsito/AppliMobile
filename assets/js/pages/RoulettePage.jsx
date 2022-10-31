import React, { useState } from "react";
import Wheel from "../components/Roulette";
import "./roulettepage.css";


const RoulettePage = (props) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const [data, setData] = useState( [

  ]);
  
  const AddOption = () => {
    return (
      <div>
        {data.map((val, i) => (
          <div key={i}>{val.option}</div>
        ))}
        <div>
          <input id="addOption" />
          <button
            id="button-submit"
            onClick={() =>
              setData((prev) => [
                ...prev,
                { option: document.getElementById("addOption").value }
              ])
            }
          >
            Ajouter
          </button>
        </div>
      </div>
    );
  };

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  return (
    <div className="roulette-page">
      <h1>Rouroulette</h1>
      <table>
        <tr>
          <td>
            <div className="formulaire">
              <form method="post" name="contact">
                <div>
                  <label for="name">Ajouter votre valeur</label>
                  <AddOption/>
                </div>
              </form>
            </div>
          </td>
          <td>
            <div id="roulette">
              <Wheel
                mustSpin={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                backgroundColors={["#ff8f43", "#70bbe0", "#0b3351", "#f9dd50"]}
                textColors={["#FFFFFF"]}
                outerBorderColor={"#eeeeee"}
                outerBorderWidth={10}
                innerBorderColor={"#30261a"}
                innerBorderWidth={0}
                innerRadius={0}
                radiusLineColor={"#eeeeee"}
                radiusLineWidth={8}
                fontSize={17}
                textDistance={60}
                onStopSpinning={() => {
                  setMustSpin(false);
                  console.log(data[prizeNumber]);
                }}
              />
              <div class="button">
                <button
                  
                  className={"spin-button"}
                  onClick={handleSpinClick}
                >
                  TOURNER
                </button>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default RoulettePage;
