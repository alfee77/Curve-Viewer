import { Chart, scales } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

const form = document.querySelector("#curve-creator-input");
const curveNameElement = document.getElementById("curve-name");
const curveTypeElement = document.getElementById("curve-type");
const pickUpSettingElement = document.getElementById("pick-up-setting");
const timeMultiplierElement = document.getElementById("time-multiplier");
let arrayOfCurves = [];
let arrayOfCurvesCards = [];
const chartArea = document.querySelector("#theChart");
let myChart;

const colorPalette = ["#f79256ff", "#7dcfb6ff", "#00b2caff", "#1d4e89ff"];

for (let i = 0; i < 4; i++) {
  arrayOfCurvesCards.push(document.querySelector(`.cdc${i}`));
}

console.log(arrayOfCurvesCards);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const curve = {
    curveName: curveNameElement.value,
    curveType: curveTypeElement.value,
    pickUpSetting: Number.parseInt(pickUpSettingElement.value),
    timeMultiplier: Number.parseFloat(timeMultiplierElement.value),
    label: `${curveNameElement.value} (${curveTypeElement.value})`,
  };

  curve.maxCurrent = Math.min(curve.pickUpSetting * 100, 63000);
  curve.data = [];
  let stepSize = (curve.maxCurrent - curve.pickUpSetting) / 500;

  switch (curve.curveType) {
    case "SI":
      for (
        let x = curve.pickUpSetting + 1;
        x <= curve.maxCurrent;
        x = x + stepSize
      ) {
        let y =
          (curve.timeMultiplier * 0.14) /
          ((x / curve.pickUpSetting) ** 0.02 - 1);
        curve.data.push({ x, y });
      }
      break;
    case "VI":
      for (
        let x = curve.pickUpSetting + 1;
        x <= curve.maxCurrent;
        x = x + stepSize
      ) {
        let y =
          (curve.timeMultiplier * 13.5) / ((x / curve.pickUpSetting) ** 1 - 1);
        curve.data.push({ x, y });
      }
      break;
    case "EI":
      for (
        let x = curve.pickUpSetting + 1;
        x <= curve.maxCurrent;
        x = x + stepSize
      ) {
        let y =
          (curve.timeMultiplier * 80) / ((x / curve.pickUpSetting) ** 2 - 1);
        curve.data.push({ x, y });
      }
      break;
    case "LTI":
      for (
        let x = curve.pickUpSetting + 1;
        x <= curve.maxCurrent;
        x = x + stepSize
      ) {
        let y =
          (curve.timeMultiplier * 120) / ((x / curve.pickUpSetting) ** 1 - 1);
        curve.data.push({ x, y });
      }
      break;
  }

  arrayOfCurves.push(curve);
  for (let i = 0; i < arrayOfCurves.length; i++) {
    arrayOfCurves[i].backgroundColor = colorPalette[i];
    arrayOfCurves[i].borderColor = colorPalette[i];

    arrayOfCurvesCards[i].classList.add("cdc-visible");
    arrayOfCurvesCards[i].innerHTML = `
    <div class="curve-card-title">
      <p>${arrayOfCurves[i].curveName}</p>
      <p>${arrayOfCurves[i].curveType}</p>
    </div>
    <div class="curve-card-settings">
      <p>Pick Up Setting: ${arrayOfCurves[i].pickUpSetting} A</p>
      <p>Time Multiplier: ${arrayOfCurves[i].timeMultiplier}</p>
    </div>`;
  }

  drawChart(arrayOfCurves);
});

function drawChart(arrayOfCurves) {
  console.log(arrayOfCurves);

  const data = {
    datasets: arrayOfCurves,
  };

  const config = {
    type: "line",
    data,
    options: {
      //maintainAspectRation: true,
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "xy",
          },
          limits: {
            x: {
              max: 63000,
            },
            y: {
              max: 10,
            },
          },
          pan: {
            enabled: true,
            modifierKet: `xy`,
            scaleMde: `xy`,
          },
        },
      },

      scales: {
        x: {
          type: "logarithmic",
          position: "bottom",
        },
        y: {
          type: "logarithmic",
          text: "Time (s)",
        },
      },

      pointRadius: 1,
      tension: 0.4,
    },
  };

  if (!myChart) {
    myChart = new Chart(chartArea, config);
  } else {
    myChart.destroy();
    myChart = new Chart(chartArea, config);
  }
}
