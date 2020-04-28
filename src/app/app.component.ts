import { Component, Inject, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { AppService } from "./app.service";
import moment from "moment";
import { Moment } from "moment";
import { ChartDataSets, ChartOptions } from "chart.js";
import * as ChartZoom from "chartjs-plugin-zoom";
import { ClassGetter } from "@angular/compiler/src/output/output_ast";
import * as Chart from 'chart.js';

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  name = "Angular";

  chart;

  constructor(private appService: AppService) {
    Chart.defaults.global.legend.onHover = function(e: MouseEvent, chartLegendLabelItem: Chart.ChartLegendLabelItem) {
      console.log('onHover');
      // console.log('chartLegendLabelItem.datasetIndex', chartLegendLabelItem.datasetIndex)
      const idx: number = chartLegendLabelItem.datasetIndex;
      // console.log('idx', chartLegendLabelItem.datasetIndex);

      const chart = this.chart as Chart;

      chart.options.scales.yAxes[idx].ticks.fontColor = 'red';

      // chart.options.scales.yAxes[idx].display = !chart.options.scales.yAxes[idx].display;

      const meta = chart.getDatasetMeta(idx);
      // console.log('meta', meta);
      // meta.hidden = meta.hidden === null ? !chart.data.datasets[idx].hidden : null;

      chart.update();
    };
    Chart.defaults.global.legend.onLeave = function(e: MouseEvent, chartLegendLabelItem: Chart.ChartLegendLabelItem) {
      console.log('onLeave');
      // console.log('chartLegendLabelItem.datasetIndex', chartLegendLabelItem.datasetIndex)
      const idx: number = chartLegendLabelItem.datasetIndex;
      // console.log('idx', chartLegendLabelItem.datasetIndex);

      const chart = this.chart as Chart;

      chart.options.scales.yAxes[idx].ticks.fontColor = 'blue';

      // chart.options.scales.yAxes[idx].display = !chart.options.scales.yAxes[idx].display;

      const meta = chart.getDatasetMeta(idx);
      // console.log('meta', meta);
      // meta.hidden = meta.hidden === null ? !chart.data.datasets[idx].hidden : null;

      chart.update();
    };
  }

  ngOnInit() {
    this.appService.getDataSet().subscribe((res) => {
      this.chart = this.mountGraph(res);
    });
  }

  mountGraph(payload) {
    let chart;
    let opposite = true;
    const yAxes = [];

    payload[0].dataset.forEach(dataset => {
      yAxes.push({
        id: dataset.yAxisID,
        type: 'linear',
        position: opposite ? 'right' : 'left',
        ticks: {
          suggestedMax: dataset.suggestedMax
        }
      });
      opposite = !opposite;
    });

    chart = {
      dataset: payload[0].dataset,
      legend: true,
      plugins: [
        {
          id: 'zoom'
        }
      ],
      options: {
        legend: {
          display: true,
          position: 'bottom',
          fullWidth: true,
          labels: {
            usePointStyle: true
            // boxWidth: 5
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItems, data) => {
              return data.datasets[tooltipItems.datasetIndex].alias
                ? data.datasets[tooltipItems.datasetIndex].label +
                    ': ' +
                    JSON.parse(data.datasets[tooltipItems.datasetIndex].alias)[tooltipItems.yLabel]
                : data.datasets[tooltipItems.datasetIndex].label +
                    ': ' +
                    tooltipItems.yLabel.toFixed(2) +
                    ' ' +
                    data.datasets[tooltipItems.datasetIndex].unit;
            },
            title: (tooltipItem, data) => {
              return data.labels[tooltipItem[0].index];
            }
          }
        },
        scales: {
          yAxes
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          colorschemes: {
            scheme: 'brewer.Paired12'
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x'
            },
            zoom: {
              enabled: true,
              drag: false,
              mode: 'x'
            }
          }
        }
      },
      labels: payload[1].labels.map(label => moment(label).format('DD/MM/YYYY hh:mm:ss')),
      chartType: 'line',
      colors: [
        {
          backgroundColor: 'transparent',
          borderColor: 'rgba(141,198,63,1)',
          pointBackgroundColor: 'rgba(141,198,63,1)',
          pointBorderColor: 'rgba(141,198,63,1)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(141,198,63,0.8)'
        },
        {
          backgroundColor: 'transparent',
          borderColor: 'rgba(51, 166, 92, 1)',
          pointBackgroundColor: 'rgba(51, 166, 92, 1)',
          pointBorderColor: 'rgba(51, 166, 92, 1)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(51, 166, 92, 0.8)'
        },
        {
          backgroundColor: 'transparent',
          borderColor: 'rgba(192, 223, 150, 1)',
          pointBackgroundColor: 'rgba(192, 223, 150, 1)',
          pointBorderColor: 'rgba(192, 223, 150, 1)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(192, 223, 150, 0.8)'
        },
        {
          backgroundColor: 'transparent',
          borderColor: 'rgba(27, 163, 120, 1)',
          pointBackgroundColor: 'rgba(27, 163, 120, 1)',
          pointBorderColor: 'rgba(27, 163, 120, 1)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(27, 163, 120, 0.8)'
        },
        {
          backgroundColor: 'transparent',
          borderColor: 'rgba(103, 145, 46, 1)',
          pointBackgroundColor: 'rgba(103, 145, 46, 1)',
          pointBorderColor: 'rgba(103, 145, 46, 1)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(103, 145, 46, 0.8)'
        }
      ]
    };

    return chart;
  }
}
