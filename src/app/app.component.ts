import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import moment from 'moment';
import { Moment} from 'moment';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})

export class AppComponent implements OnInit  {
  name = 'Angular';
  data = [];


  type: string;
  dataset = [];
  options = null;
  labels: any;
  legend: boolean;


  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getDataSet().subscribe((res: any[]) => {
      const data = [];
      const yAxes = [];
      let opposite = false;
      res.forEach(variable => {
        yAxes.push({
          id: variable.variableName.slice(0, 1),
          labelString: variable.variableName,
          type: 'linear',
          position: opposite ? 'right' : 'left'
        });
        opposite = !opposite;
      })

      console.log('y axes', yAxes)

      res.map(variable => {
        variable.pointsList.forEach(point => {
          data.push({
            name: variable.variableName,
            value: point.value,
            datetime: point.datetime,
            unit: variable.variableName.slice(0, 1)
          })
        })
      })
      this.data = data;

      console.log(this.data)

      let uniqDatetimes;
      let uniqueNames

      // TO FIND UNIQUE ARRAY
      var datetimes = data.map(t => t.datetime);
      uniqDatetimes = datetimes.filter((item, pos) => {
        return datetimes.indexOf(item) === pos;
      });
      console.log('UNIQUE MONTHS:- '+uniqDatetimes);

      var names = data.map(t => t.name);
      uniqueNames = names.filter((item, pos) => {
          return names.indexOf(item) === pos;
      });
      console.log('UNIQUE NAMES:- '+uniqueNames);
      var countArr = {};
      uniqueNames.forEach(d => {
        var arr = [];
        uniqDatetimes.forEach(k =>{
          arr.push(getValue(d, k));
        });
        countArr[d] = arr;
        this.dataset.push({
          id: d,
          data: arr,
          yAxisID: d.slice(0, 1)
        })
      });
      console.log('COUNT ARRAY:- '+JSON.stringify(countArr));

      // To get value from the array
      function getValue(name, datetime){
        var value = 0;
        data.forEach(d => {
          if (d.name === name && d.datetime === datetime){
            value = d.value;
          }
        });
        return value;
      }


      console.log('dataset', this.dataset)

      this.labels = uniqueNames;
      this.options = {
        scales: {yAxes: yAxes},
      };
      this.legend = true;
      this.type = 'bar';

      console.log('options', this.options)
    })



  }

}