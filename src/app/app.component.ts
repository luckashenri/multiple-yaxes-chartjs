import { Component, Inject, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { AppService } from "./app.service";
import moment from "moment";
import { Moment } from "moment";

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
      options: { scales: { yAxes: yAxes } },
      dataset: dataset,
      legend: true,
      labels: uniqDatetimes,
      chartType: "bar"
    };

    console.log("chart", chart);
    return chart;
  }
}
