import { Chart } from "chart.js/auto";

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
  const data = {
    datasets: arrayOfCurves,
  };

  const config = {
    type: "line",
    data,
    options: {
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

// Get the modal and it's sub elements
const modal = document.getElementById("myModal");
const modalCurveName = document.getElementById("m-curve-name");
const modalCurveType = document.getElementById("m-curve-type");
const modalPickUpSetting = document.getElementById("m-pick-up-setting");
const modalTimeMultiplier = document.getElementById("m-time-multiplier");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

for (let i = 0; i < arrayOfCurvesCards.length; i++) {
  arrayOfCurvesCards[i].addEventListener("click", (event) => {
    event.preventDefault();
    console.log(arrayOfCurvesCards[i]);
    modal.style.display = "block";
    modalCurveName.value = `${arrayOfCurves[i].curveName}`;
    modalCurveType.value = `${arrayOfCurves[i].curveType}`;
    modalPickUpSetting.value = `${arrayOfCurves[i].pickUpSetting}`;
    modalTimeMultiplier.value = `${arrayOfCurves[i].timeMultiplier}`;
  });
}
