// total sale
var options = {
  chart: {
    type: "area",
    height: 250,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  series: [
    {
      data: [
        [1351202400000, 37.3],
        [1351638000000, 37.6],
        [1351724400000, 37.5],
        [1351810800000, 37.55],
        [1352070000000, 37.4],
        [1352256400000, 37.55],
        [1352342800000, 37.45],
        [1352429200000, 37.6],
        [1352515600000, 37.5],
        [1352624000000, 37.3],
        [1352761200000, 37.2],
        [1353134000000, 37.25],
        [1353220400000, 37.22],
        [1353279600000, 37.3],
        [1353466000000, 37.23],
        [1353632400000, 37.3],
        [1353757200000, 37.28],
        [1353857200000, 37.3],
      ],
    },
  ],
  markers: {
    size: 0,
    style: "hollow",
  },
  grid: {
    borderColor: "transparent",
  },
  xaxis: {
    type: "datetime",
    tickAmount: 6,
    low: 0,
    offsetX: 0,
    offsetY: 0,
  },
  yaxis: {
    opposite: true,
    low: 0,
    offsetX: 0,
    offsetY: 0,
  },
  stroke: {
    width: [2],
  },
  title: {
    text: "مجموع خرید ",
    align: "right",
  },
  subtitle: {
    text: "قیمت ",
    align: "right",
  },
  tooltip: {
    x: {
      format: "dd MM ",
    },
  },
  colors: ["#ff4c3b"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.5,
      stops: [0, 100],
    },
  },
};

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();

// orders

var options = {
  series: [20, 25, 55],
  chart: {
    type: "donut",
    height: 250,
  },
  floating: true,
  dataLabels: {
    enabled: false,
  },
  title: {
    text: "فروش",
    align: "center",
  },
  labels: ["سفارشات اخیر ", "سفارشات دیروز ", "سفارشات هفته "],
  colors: ["#f7bfc1", "#c8c8c8", "#ff8181"],
  responsive: [
    {
      breakpoint: 1430,
      options: {
        chart: {
          width: 280,
          height: 285,
        },
        legend: {
          position: "bottom",
        },
      },
      breakpoint: 1199,
      options: {
        chart: {
          width: 250,
          height: 290,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

var chart = new ApexCharts(document.querySelector("#chart-order"), options);
chart.render();
