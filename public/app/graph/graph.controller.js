(function () {
  'use strict';

  angular
    .module('wally')
    .controller('Graph', Graph);

  Graph.$inject = ['$scope', '$http']

  function Graph($scope, $http) {
    var vm = this;

    var cellSize = 17;
    var xOffset = 20;
    var yOffset = 60;
    var calY = 50; //offset of calendar in each group
    var calX = 25;
    var width = 960;
    var height = 163;

    var parseDate = d3.time.format("%Y/%m/%d").parse;
    const format = d3.time.format("%d-%m-%Y");
    const toolDate = d3.time.format("%d/%b/%y %x");

    $scope.graph = null;
    $scope.noData = true;
    $scope.showGraph = showGraph;

    $scope.$on('stock.updated', showGraph);

    function showGraph() {
      $http({
        method: 'GET',
        url: '/api/stats/calendar'
      }).then(function onSuccess(response) {
        if (response.status === 200 && response.data) {
          // get an array of array [[date, count],[date, count]...]
          var data = response.data;
          if (data.length > 0) {
            $scope.noData = false;
            d3.select("#calendar").remove();
            draw(data);
          }
        }
      });
    }

    function draw(data) {

      var units = " Actions acquises";
      var breaks = [2, 5, 10, 20];
      var colours = ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"];

      var dates = [];
      var values = [];

      data.forEach(function (d) {
        dates.push(parseDate(d.date));
        values.push(d.value);
        d.date = parseDate(d.date);
        d.value = d.value;
        d.year = d.date.getFullYear()
      });

      var yearlyData = d3.nest()
        .key(function (d) {
          return d.year;
        })
        .entries(data);

      var svg = d3.select("#graph").append("svg")
        .attr("id", "calendar")
        .attr("width", "100%")
        .attr("viewBox", "0 0 " + (xOffset + width) + " 540")

      //create an SVG group for each year
      var cals = svg.selectAll("g")
        .data(yearlyData)
        .enter()
        .append("g")
        .attr("id", function (d) {
          return d.key;
        })
        .attr("transform", function (d, i) {
          return "translate(0," + (yOffset + (i * (height + calY))) + ")";
        });

      var labels = cals.append("text")
        .attr("class", "yearLabel")
        .attr("x", xOffset)
        .attr("y", 15)
        .text(function (d) {
          return d.key
        });

      //create a daily rectangle for each year
      var rects = cals.append("g")
        .attr("id", "alldays")
        .selectAll(".day")
        .data(function (d) {
          return d3.time.days(new Date(parseInt(d.key), 0, 1), new Date(parseInt(d.key) + 1, 0, 1));
        })
        .enter().append("rect")
        .attr("id", function (d) {
          return "_" + format(d);
          //return toolDate(d.date)+":\n"+d.value+" dead or missing";
        })
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function (d) {
          return xOffset + calX + (d3.time.weekOfYear(d) * cellSize);
        })
        .attr("y", function (d) {
          return calY + (d.getDay() * cellSize);
        })
        .datum(format);

      //create day labels
      var days = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
      var dayLabels = cals.append("g").attr("id", "dayLabels")
      days.forEach(function (d, i) {
        dayLabels.append("text")
          .attr("class", "dayLabel")
          .attr("x", xOffset)
          .attr("y", function (d) {
            return calY + (i * cellSize);
          })
          .attr("dy", "0.9em")
          .text(d);
      })

      //let's draw the data on
      var dataRects = cals.append("g")
        .attr("id", "dataDays")
        .selectAll(".dataday")
        .data(function (d) {
          return d.values;
        })
        .enter()
        .append("rect")
        .attr("id", function (d) {
          return format(d.date) + ":" + d.value;
        })
        .attr("stroke", "#ccc")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function (d) {
          return xOffset + calX + (d3.time.weekOfYear(d.date) * cellSize);
        })
        .attr("y", function (d) {
          return calY + (d.date.getDay() * cellSize);
        })
        .attr("fill", function (d) {
          if (d.value < breaks[0]) {
            return colours[0];
          }
          for (i = 0; i < breaks.length + 1; i++) {
            if (d.value >= breaks[i] && d.value < breaks[i + 1]) {
              return colours[i];
            }
          }
          if (d.value > breaks.length - 1) {
            return colours[breaks.length]
          }
        });

      //append a title element to give basic mouseover info
      dataRects.append("title")
        .text(function (d) {
          return toolDate(d.date) + ":\n" + d.value + units;
        });

      //add montly outlines for calendar
      cals.append("g")
        .attr("id", "monthOutlines")
        .selectAll(".month")
        .data(function (d) {
          return d3.time.months(new Date(parseInt(d.key), 0, 1),
            new Date(parseInt(d.key) + 1, 0, 1));
        })
        .enter().append("path")
        .attr("class", "month")
        .attr("transform", "translate(" + (xOffset + calX) + "," + calY + ")")
        .attr("d", monthPath);

      //retreive the bounding boxes of the outlines
      var BB = new Array();
      var mp = document.getElementById("monthOutlines").childNodes;
      for (var i = 0; i < mp.length; i++) {
        BB.push(mp[i].getBBox());
      }

      var monthX = new Array();
      BB.forEach(function (d, i) {
        var boxCentre = d.width / 2;
        monthX.push(xOffset + calX + d.x + boxCentre);
      })

      //create centred month labels around the bounding box of each month path
      //create day labels
      var months = ['JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'];
      var monthLabels = cals.append("g").attr("id", "monthLabels")
      months.forEach(function (d, i) {
        monthLabels.append("text")
          .attr("class", "monthLabel")
          .attr("x", monthX[i])
          .attr("y", calY / 1.2)
          .text(d);
      })
    }

    function monthPath(t0) {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(),
        w0 = d3.time.weekOfYear(t0),
        d1 = t1.getDay(),
        w1 = d3.time.weekOfYear(t1);
      return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize +
        "H" + w0 * cellSize + "V" + 7 * cellSize +
        "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize +
        "H" + (w1 + 1) * cellSize + "V" + 0 +
        "H" + (w0 + 1) * cellSize + "Z";
    }
  }
})();