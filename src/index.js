import { Chart, plugins } from "chart.js/auto";

// Curve input elements
const curveForm = document.getElementById("curve-creator-input");
const curveNameElement = document.getElementById("curve-name");
const curveTypeElement = document.getElementById("curve-type");
const pickUpSettingElement = document.getElementById("pick-up-setting");
const timeMultiplierElement = document.getElementById("time-multiplier");
let arrayOfCurves = [];

//Fault level input elements
const flForm = document.getElementById("fault-level-input");
const faultLocationElement = document.getElementById("fault-location");
const faultLevelElement = document.getElementById("fault-level");
let arrayOfFLs = [];

//chart elements
const chartArea = document.querySelector("#theChart");
let myChart;
const colorPalette = ["#f79256ff", "#7dcfb6ff", "#00b2caff", "#1d4e89ff"];

//card elements
let arrayOfCurvesCards = [];
let arrayOfFLCards = [];
for (let i = 0; i < 10; i++) {
  arrayOfCurvesCards.push(document.querySelector(`.cdc${i}`));
}

for (let i = 0; i < 10; i++) {
  arrayOfFLCards.push(document.querySelector(`.fldc${i}`));
}

curveForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const curve = {
    curveName: curveNameElement.value,
    curveType: curveTypeElement.value,
    pickUpSetting: Number.parseInt(pickUpSettingElement.value),
    timeMultiplier: Number.parseFloat(timeMultiplierElement.value),
    label: `${curveNameElement.value} (${curveTypeElement.value})`,
  };

  arrayOfCurves.push(curve);
  for (let i = 0; i < arrayOfCurves.length; i++) {
    arrayOfCurves[i].backgroundColor = colorPalette[i];
    arrayOfCurves[i].borderColor = colorPalette[i];

    arrayOfCurvesCards[i].classList.add("cdc-visible");
    arrayOfCurvesCards[i].innerHTML = `
    <div class="card-title">
      <p>${arrayOfCurves[i].curveName}</p>
      <div style="background: ${colorPalette[i]}; height: 10px; width: 10px; border-radius: 50%"></div>
    </div>
    <div class="card-body">
      <p>Curve Type: ${arrayOfCurves[i].curveType}</p>
      <p>Pick Up Setting: ${arrayOfCurves[i].pickUpSetting} A</p>
      <p>Time Multiplier: ${arrayOfCurves[i].timeMultiplier}</p>
    </div>`;
  }

  drawChart(arrayOfCurves);
});

flForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const faultLevel = {
    locationName: faultLocationElement.value,
    locationLevel: Number.parseInt(faultLevelElement.value),
    data: [],
  };
  console.log(faultLevel);

  arrayOfFLs.push(faultLevel);

  for (let i = 0; i < arrayOfFLs.length; i++) {
    arrayOfFLs[i].backgroundColor = colorPalette[i];
    arrayOfFLs[i].borderColor = colorPalette[i];

    let x = arrayOfFLs[i].locationLevel;
    let y = 0;
    arrayOfFLs[i].data.push({ x, y });

    x = arrayOfFLs[i].locationLevel;
    y = 6000;
    arrayOfFLs[i].data.push({ x, y });

    arrayOfFLCards[i].classList.add("cdc-visible");
    arrayOfFLCards[i].innerHTML = `
    <div class="card-title">
      <p>${arrayOfFLs[i].locationName}</p>
      <div style="background: ${colorPalette[i]}; height: 10px; width: 10px; border-radius: 50%"></div>
    </div>
    <div class="card-body">
      <p>Fault level: ${arrayOfFLs[i].locationLevel}</p>
    </div>`;
  }

  console.log(arrayOfFLs);

  drawChart(arrayOfCurves);
});

//Function draws the chart
function drawChart(pArrayOfCurves) {
  calculateChartData();

  if (myChart) {
    myChart.destroy();
  }

  const config = {
    type: "line",
    data: {
      datasets: pArrayOfCurves,
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          type: "logarithmic",
          position: "bottom",
          title: {
            display: true,
            text: "Current (A)",
          },
        },
        y: {
          type: "logarithmic",
          title: {
            display: true,
            text: "Time (s)",
          },
        },
      },
      pointRadius: 1,
      tension: 0.4,
    },
  };
  myChart = new Chart(chartArea, config);
}

// Get the modal and it's sub elements
const curveModal = document.getElementById("curveModal");
const curveModalCurveName = document.getElementById("m-curve-name");
const curveModalCurveType = document.getElementById("m-curve-type");
const curveModalPickUpSetting = document.getElementById("m-pick-up-setting");
const curveModalTimeMultiplier = document.getElementById("m-time-multiplier");
const curveModalSaveButton = document.getElementById("m-save-btn");
const curveModalDeleteButton = document.getElementById("m-delete-btn");

// When the user clicks anywhere outside of the curveModal, close it
window.onclick = function (event) {
  if (event.target == curveModal) {
    curveModal.style.display = "none";
  }
};

let selectedCardIndex;

//This adds the event listener to each curve details card
for (let i = 0; i < arrayOfCurvesCards.length; i++) {
  arrayOfCurvesCards[i].addEventListener("click", (event) => {
    event.preventDefault();
    curveModal.style.display = "block";
    curveModalCurveName.value = `${arrayOfCurves[i].curveName}`;
    curveModalCurveType.value = `${arrayOfCurves[i].curveType}`;
    curveModalPickUpSetting.value = `${arrayOfCurves[i].pickUpSetting}`;
    curveModalTimeMultiplier.value = `${arrayOfCurves[i].timeMultiplier}`;
    selectedCardIndex = i;
  });
}

curveModalSaveButton.addEventListener("click", (event) => {
  event.preventDefault();
  arrayOfCurves[selectedCardIndex].curveName = curveModalCurveName.value;
  arrayOfCurves[selectedCardIndex].curveType = curveModalCurveType.value;
  arrayOfCurves[selectedCardIndex].pickUpSetting = Number.parseInt(
    curveModalPickUpSetting.value,
  );
  arrayOfCurves[selectedCardIndex].timeMultiplier = Number.parseFloat(
    curveModalTimeMultiplier.value,
  );

  //update the curve card
  arrayOfCurvesCards[selectedCardIndex].innerHTML = `
    <div class="card-title">
      <p>${arrayOfCurves[selectedCardIndex].curveName}</p>
      <div style="background: ${colorPalette[selectedCardIndex]}; height: 10px; width: 10px; border-radius: 50%"></div>
    </div>
    <div class="card-body">
      <p>Curve Type: ${arrayOfCurves[selectedCardIndex].curveType}</p>
      <p>Pick Up Setting: ${arrayOfCurves[selectedCardIndex].pickUpSetting} A</p>
      <p>Time Multiplier: ${arrayOfCurves[selectedCardIndex].timeMultiplier}</p>
    </div>`;
  //redraw the chart
  drawChart(arrayOfCurves);

  curveModal.style.display = "none";
});

curveModalDeleteButton.addEventListener("click", (event) => {
  event.preventDefault();

  //redraw the chart
  arrayOfCurves.splice(selectedCardIndex, 1);
  arrayOfCurvesCards[selectedCardIndex].classList.remove("cdc-visible");
  selectedCardIndex = 0;
  drawChart(arrayOfCurves);

  for (let i = 0; i < arrayOfCurvesCards.length; i++) {
    arrayOfCurvesCards[i].classList.remove("cdc-visible");
  }

  for (let i = 0; i < arrayOfCurves.length; i++) {
    arrayOfCurves[i].backgroundColor = colorPalette[i];
    arrayOfCurves[i].borderColor = colorPalette[i];

    arrayOfCurvesCards[i].classList.add("cdc-visible");
    arrayOfCurvesCards[i].innerHTML = `
    <div class="card-title">
      <p>${arrayOfCurves[i].curveName}</p>
      <div style="background: ${colorPalette[i]}; height: 10px; width: 10px; border-radius: 50%"></div>
    </div>
    <div class="card-body">
      <p>Curve Type: ${arrayOfCurves[i].curveType}</p>
      <p>Pick Up Setting: ${arrayOfCurves[i].pickUpSetting} A</p>
      <p>Time Multiplier: ${arrayOfCurves[i].timeMultiplier}</p>
    </div>`;
  }
  curveModal.style.display = "none";
});

function calculateChartData() {
  arrayOfCurves.forEach((curve) => {
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
            (curve.timeMultiplier * 13.5) /
            ((x / curve.pickUpSetting) ** 1 - 1);
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
  });
}
