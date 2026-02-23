import { Chart, plugins } from "chart.js/auto";

// Curve input elements
const addCurveBtn = document.getElementById("addCurveBtn");
const addCurveModal = document.getElementById("addCurveModal");
const curveCreationForm = document.getElementById("curve-creation-form");
const curveNameElement = document.getElementById("curve-name");
const curveTypeElement = document.getElementById("curve-type");
const pickUpSettingElement = document.getElementById("pick-up-setting");
const timeMultiplierElement = document.getElementById("time-multiplier");
let arrayOfCurves = [];

//Fault level input elements
const addFLBtn = document.getElementById("addFLBtn");
const addFLModal = document.getElementById("addFLModal");
const flForm = document.getElementById("fault-level-creation-form");
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

let selectedCardIndex;

for (let i = 0; i < 10; i++) {
  arrayOfCurvesCards.push(document.querySelector(`.cdc${i}`));
  arrayOfFLCards.push(document.querySelector(`.fldc${i}`));
}

addCurveBtn.addEventListener("click", (event) => {
  event.preventDefault();
  addCurveModal.style.display = "block";
});

addFLBtn.addEventListener("click", (event) => {
  event.preventDefault();
  addFLModal.style.display = "block";
});

curveCreationForm.addEventListener("submit", (event) => {
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
  addCurveModal.style.display = "none";
});

flForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const faultLevel = {
    locationName: faultLocationElement.value,
    locationLevel: Number.parseInt(faultLevelElement.value),
    data: [],
  };

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

  addFLModal.style.display = "none";

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

// Get the edit curve modal and it's sub elements
const editCurveModal = document.getElementById("editCurveModal");
const editCurveModalCurveName = document.getElementById("m-curve-name");
const editCurveModalCurveType = document.getElementById("m-curve-type");
const editCurveModalPickUpSetting =
  document.getElementById("m-pick-up-setting");
const editCurveModalTimeMultiplier =
  document.getElementById("m-time-multiplier");
const editCurveModalSaveButton = document.getElementById("m-save-btn");
const editCurveModalDeleteButton = document.getElementById("m-delete-btn");

//This adds the event listener to each curve details card
for (let i = 0; i < arrayOfCurvesCards.length; i++) {
  arrayOfCurvesCards[i].addEventListener("click", (event) => {
    event.preventDefault();
    editCurveModal.style.display = "block";
    editCurveModalCurveName.value = `${arrayOfCurves[i].curveName}`;
    editCurveModalCurveType.value = `${arrayOfCurves[i].curveType}`;
    editCurveModalPickUpSetting.value = `${arrayOfCurves[i].pickUpSetting}`;
    editCurveModalTimeMultiplier.value = `${arrayOfCurves[i].timeMultiplier}`;
    selectedCardIndex = i;
  });
}

editCurveModalSaveButton.addEventListener("click", (event) => {
  event.preventDefault();
  arrayOfCurves[selectedCardIndex].curveName = editCurveModalCurveName.value;
  arrayOfCurves[selectedCardIndex].curveType = editCurveModalCurveType.value;
  arrayOfCurves[selectedCardIndex].pickUpSetting = Number.parseInt(
    editCurveModalPickUpSetting.value,
  );
  arrayOfCurves[selectedCardIndex].timeMultiplier = Number.parseFloat(
    editCurveModalTimeMultiplier.value,
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

  editCurveModal.style.display = "none";
});

editCurveModalDeleteButton.addEventListener("click", (event) => {
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
  editCurveModal.style.display = "none";
});

// Get the edit curve modal and it's sub elements
const editFLModal = document.getElementById("editFLModal");
const editFLModalFaultLocation = document.getElementById("flm-fault-location");
const editFLModalFaultLevel = document.getElementById("flm-fault-level");
const editFLModalSaveButton = document.getElementById("flm-save-btn");
const editFLModalDeleteButton = document.getElementById("flm-delete-btn");

//This adds the event listener to each FL details card
for (let i = 0; i < arrayOfFLCards.length; i++) {
  arrayOfFLCards[i].addEventListener("click", (event) => {
    event.preventDefault();
    editFLModal.style.display = "block";
    editFLModalFaultLocation.value = arrayOfFLs[i].locationName;
    editFLModalFaultLevel.value = arrayOfFLs[i].locationLevel;

    selectedCardIndex = i;
  });
}

editFLModalSaveButton.addEventListener("click", (event) => {
  event.preventDefault();

  arrayOfFLs[selectedCardIndex].locationName = editFLModalFaultLocation.value;
  arrayOfFLs[selectedCardIndex].locationLevel = editFLModalFaultLevel.value;

  //update the FL card
  arrayOfFLCards[selectedCardIndex].innerHTML = `
    <div class="card-title">
      <p>${arrayOfFLs[selectedCardIndex].locationName}</p>
      <div style="background: ${colorPalette[selectedCardIndex]}; height: 10px; width: 10px; border-radius: 50%"></div>
    </div>
    <div class="card-body">
      <p>Fault level: ${arrayOfFLs[selectedCardIndex].locationLevel}</p>
    </div>`;
  //redraw the chart
  drawChart(arrayOfCurves);

  editFLModal.style.display = "none";
});

editFLModalDeleteButton.addEventListener("click", (event) => {
  event.preventDefault();

  //redraw the chart
  arrayOfFLs.splice(selectedCardIndex, 1);
  arrayOfFLCards[selectedCardIndex].classList.remove("cdc-visible");
  selectedCardIndex = 0;
  drawChart(arrayOfCurves);

  for (let i = 0; i < arrayOfFLCards.length; i++) {
    arrayOfFLCards[i].classList.remove("cdc-visible");
  }

  for (let i = 0; i < arrayOfFLs.length; i++) {
    arrayOfFLs[i].backgroundColor = colorPalette[i];
    arrayOfFLs[i].borderColor = colorPalette[i];

    arrayOfFLCards[i].innerHTML = `
    <div class="card-title">
      <p>${arrayOfFLs[i].locationName}</p>
      <div style="background: ${colorPalette[i]}; height: 10px; width: 10px; border-radius: 50%"></div>
    </div>
    <div class="card-body">
      <p>Fault level: ${arrayOfFLs[i].locationLevel} A</p>
    </div>`;
    arrayOfFLCards[i].classList.add("cdc-visible");
  }
  editFLModal.style.display = "none";
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

// When the user clicks anywhere outside of the add or editCurveModal, close it
window.onclick = function (event) {
  if (
    event.target == addCurveModal ||
    event.target == editCurveModal ||
    event.target == addFLModal ||
    event.target == editFLModal
  ) {
    editCurveModal.style.display = "none";
    addCurveModal.style.display = "none";
    addFLModal.style.display = "none";
    editFLModal.style.display = "none";
  }
};

// When the user clicks the escape key close all modals
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    editCurveModal.style.display = "none";
    addCurveModal.style.display = "none";
    addFLModal.style.display = "none";
    editFLModal.style.display = "none";
  }
});
