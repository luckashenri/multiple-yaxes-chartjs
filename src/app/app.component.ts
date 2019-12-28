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

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getDataSet().subscribe((res: any[]) => {

      console.log('dataset', res)
      console.time("all");
      let labels;
      let auxLabels = [];
      let datasets = [];
      let auxDatasets = [];
      const yAxes = [];

      let auxData = [];
      let test = []
      let test2 = []

      res.forEach(variable => {
        console.log('variable', variable)
        // GETTING LABELS
        let xAxesReduce = [];
        variable.pointsList.map(el => {
          auxLabels.push(moment(el.datetime).toISOString());
        });
        labels = Array.from([...new Set(auxLabels)]);


        // GETTING DATASETS
        auxDatasets.push({
          label: variable.variableName,
          xAxisID: variable.variableName.slice(0, 1)
        })

        for (let i = 0; i < labels.length; i++) {
          // console.log('label[i]', labels[i], labels.length)
          // for (let j = 0; j < variable.pointsList.length; j++) {
          //   console.log('point', variable.pointsList[i] ? variable.pointsList[i].value : 0)
          //   // test.push(variable.pointsList[i] ? variable.pointsList[i].value : 0)

          // }
          // variable.pointsList.forEach(point => {
          //   console.log('point', moment(point.datetime));
          //   console.log('label[i]', labels[i]);
          //   test[i] = labels.find(item => moment(item).format('x') === moment(point.datetime).format('x')) ? point.value : 0;
          // })
        }
        test2.push(test)
      })


      console.log('test2', test2)
      console.timeEnd("all");
    })
  }

}