import { Component, Inject, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { AppService } from "./app.service";
import moment from "moment";
import { Moment } from "moment";
import { ChartDataSets, ChartOptions } from "chart.js";
import * as ChartZoom from "chartjs-plugin-zoom";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  name = "Angular";

  chart;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getDataSet().subscribe((res: any[]) => {
      this.chart = this.mountGraph(res);
    });
  }

  mountGraph(payload) {
    console.log("original", payload);
    const data = [];
    const yAxes = [];
    let dataset = [];
    let chart;
    let opposite = false;

    payload.forEach(variable => {
      yAxes.push({
        id: variable.variableName,
        type: "linear",
        position: opposite ? "right" : "left"
      });
      opposite = !opposite;
    });

    payload.map(variable => {
      variable.pointsList.forEach(point => {
        data.push({
          name: variable.variableName,
          value: point.value,
          datetime: point.datetime,
          unit: variable.variableName
        });
      });
    });

    let uniqDatetimes;
    let uniqueNames;

    // TO FIND UNIQUE ARRAY
    var datetimes = data.map(t => t.datetime);
    uniqDatetimes = datetimes.filter((item, pos) => {
      return datetimes.indexOf(item) === pos;
    });
    console.log("UNIQUE MONTHS:- " + uniqDatetimes);

    var names = data.map(t => t.name);
    uniqueNames = names.filter((item, pos) => {
      return names.indexOf(item) === pos;
    });
    console.log("UNIQUE NAMES:- " + uniqueNames);
    var countArr = {};
    uniqueNames.forEach(d => {
      var arr = [];
      uniqDatetimes.forEach(k => {
        arr.push(getValue(d, k));
      });
      countArr[d] = arr;
      dataset.push({
        id: d,
        label: d,
        data: arr,
        yAxisID: d
      });
    });
    console.log("COUNT ARRAY:- " + JSON.stringify(countArr));

    // To get value from the array
    function getValue(name, datetime) {
      var value = 0;
      data.forEach(d => {
        if (d.name === name && d.datetime === datetime) {
          value = d.value;
        }
      });
      return value;
    }

    console.log("dataset", dataset);

    chart = {
      options: {
        legend: {
        display: true,
        position: 'bottom',
        fullWidth: true
      },
        scales: {
          yAxes: yAxes,
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
                unitStepSize: 1,
                displayFormats: {
                  day: 'DD/MM/YYYY hh:mm'
                }
              }
            }
          ]
        },
        plugins: {
          zoom: {
            pan: {
              // Add only if zoom isn't drag: true
              // Boolean to enable panning
              enabled: true,

              // Panning directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow panning in the y direction
              mode: "x"
            },
            zoom: {
              enabled: true,
              drag: false,
              mode: "x"
            }
          }
        }
      },
      dataset: dataset,
      legend: { position: 'bottom' },
      labels: uniqDatetimes,
      chartType: "bar",
      plugins: [ChartZoom]
    };

    console.log("chart", chart);
    return chart;
  }
}
