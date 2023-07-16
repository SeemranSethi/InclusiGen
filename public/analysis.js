"use strict";
let ans = document.getElementsByClassName("drop-down");
let i;
for (i = 0; i < ans.length; i++) {
  ans[i].addEventListener("click", function (e) {
    e.preventDefault();
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

//fetch data to be filled in graph from the server
//graph 1
const result1 = {};
fetch("/gender-job")
  .then((response) => response.json())
  .then((data) => {
    console.log("Data ", data);

    data.forEach((item) => {
      const gender = item.gender;
      item.jobs.forEach((job) => {
        if (!result1[gender]) {
          result1[gender] = [];
        }

        result1[gender].push(job.count);
      });
    });

    //plotting graph
    const ctx = document.getElementById("myCanvas1");

    const labels = ["Associate", "Administrator", "Manager"];
    const data1 = {
      labels: labels,
      datasets: [
        {
          label: "Cis Female",
          data: result1["Cis Female"],
          backgroundColor: "rgb(24, 9, 186)",
        },
        {
          label: "Cis Male",
          //data:[cis make ke manager,cis male ke administration, cis make ke associate]
          data: result1["Cis Male"],
          backgroundColor: "rgb(40, 106, 250)",
        },
        {
          label: "Transgender",
          data: result1["Transgender"],
          backgroundColor: "rgb(7, 195, 247)",
        },
        {
          label: "Non binary",
          data: result1["Non binary"],
          backgroundColor: "rgb(66, 245, 245)",
        },
      ],
    };

    let delayed;
    new Chart(ctx, {
      type: "bar",
      data: data1,
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === "data" &&
              context.mode === "default" &&
              !delayed
            ) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });
  })
  .catch((error) => console.error(error));

//graph 2
const result2 = {};
fetch("/salary-by-gender")
  .then((response) => response.json())
  .then((data) => {
    console.log("Data ", data);
    data.forEach((item) => {
      const gender = item.gender;
      const salaries = item.salary;
      result2[gender] = salaries;
    });

    //plotting graph
    var trace1 = {
      x: result2["Cis Male"],
      type: "histogram",
      name: "cis-male",
      marker: {
        color: "rgba(24,9,186,1)",
      },
    };

    //cis female
    var trace2 = {
      x: result2["Cis Female"],
      type: "histogram",
      name: "cis-female",
      marker: {
        color: "rgba(40,106,250,1)",
      },
    };

    //transgender
    var trace3 = {
      x: result2["Transgender"],
      type: "histogram",
      name: "transgender",
      marker: {
        color: "rgba(7,195,247,1)",
      },
    };
    //non-binary
    var trace4 = {
      x: result2["Non binary"],
      type: "histogram",
      name: "non-binary",
      marker: {
        color: "rgba(66,245,245,1)",
      },
    };

    //getting all the values of the legend together in an array
    var data2 = [trace1, trace2, trace3, trace4];

    //Layout of the graph
    var layout = {
      barmode: "stack",
      title: "Gender-wise Salary Distribution",
      xaxis: { title: "Salary" },
      yaxis: { title: "No. of people" },
    };

    //Plotting the graph in a div tag with id="myCanvas2"
    Plotly.newPlot("myCanvas2", data2, layout);
  })
  .catch((error) => console.error(error));

//graph 3
const ctx2 = document.getElementById("myCanvas3");
new Chart(ctx2, {
  type: "bar",
  data: {
    labels: ["Cis-Female", "Cis-Male", "Transgender", "Non-binary"],
    datasets: [
      {
        axis: "y",
        label: "Training and Development",
        data: [2, 0, 1, 2],
        backgroundColor: [
          " rgb(66, 245, 245,0.3)",
          "rgb(7, 195, 247,0.3)",
          "rgb(40, 106, 250,0.3)",
          "rgb(24, 9, 186,0.3)",
        ],
        borderColor: [
          " rgb(66, 245, 245)",
          "rgb(7, 195, 247)",
          "rgb(40, 106, 250)",
          "rgb(24, 9, 186)",
        ],
        borderWidth: 1.5,
      },
    ],
  },
  options: {
    scales: {
      indexAxis: "y",
    },
  },
});

//graph 4
// Define the colorscale for the heatmap
var colorscaleVal = [
  [0, "rgb(66,245,245)"], // Color for value 0
  [1, "rgb(24,9,186)"], // Color for value 1
];

// Define the data for the heatmap
var data3 = [
  {
    x: [
      "Career development",
      "Workplace relationships",
      "Sports",
      "Volunteering",
      "Webinars",
    ], // Factors on the x-axis
    y: ["Cis Male", "Cis Female", "Transgender", "Non binary"], // Types of employees on the y-axis
    z: [
      [6.67, 7.33, 8, 7.67, 8.33], // Ratings for each factor and employee combination
      [9, 8, 8, 7.5, 8.5],
      [7.5, 8, 7.5, 8.5, 8.5],
      [7.67, 7, 7.67, 8.33, 8.67],
    ],
    colorscale: colorscaleVal, // Assign the colorscale
    type: "heatmap", // Specify the type of plot as heatmap
  },
];

// Define the layout for the heatmap
var layout1 = {
  title: "Employee Performance Heatmap", // Title of the plot
  xaxis: { title: "Factors" }, // Title for the x-axis
  yaxis: { title: "Employees" }, // Title for the y-axis
  autosize: false, // Disable autosizing
  width: 900, // Width of the plot
  height: 800, // Height of the plot
};

// Create the heatmap plot
Plotly.newPlot("myCanvas4", data3, layout1).then(function () {
  var heatmapData = data3[0].z; // Extract the heatmap data

  var factors = [
    "Career development",
    "Workplace relationships",
    "Sports",
    "Volunteering",
    "Webinars",
  ];
  var factorAverages = [];

  // Calculate average ratings for each factor
  for (var i = 0; i < factors.length; i++) {
    var ratings = heatmapData.map(function (row) {
      return row[i];
    });

    var average =
      ratings.reduce(function (sum, rating) {
        return sum + rating;
      }, 0) / ratings.length;

    factorAverages.push({ factor: factors[i], average: average });
  }

  // Sort factors by average rating in descending order
  factorAverages.sort(function (a, b) {
    return b.average - a.average;
  });

  // Generate insights for each factor
  for (var j = 0; j < factorAverages.length; j++) {
    var factor = factorAverages[j].factor;
    var averageRating = factorAverages[j].average.toFixed(2);
  }
});
//displaying graphs
const links = document.querySelectorAll(".nav-link");
const canvases = document.querySelectorAll(".canvas");

// Event listener for hyperlink clicks
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("data-target");
    showCanvas(target);
  });
});

// Function to show the selected canvas and hide the others
function showCanvas(target) {
  canvases.forEach((canvas) => {
    if (canvas.id === target) {
      canvas.style.display = "block";
    } else {
      canvas.style.display = "none";
    }
  });
}
