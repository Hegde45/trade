import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartJSService } from '../chartjs.service';

import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsSunburst from 'highcharts/modules/sunburst';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
HighchartsSunburst(Highcharts);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, AfterViewInit {

  chart!: Highcharts.Chart;
  pendingTicks: any[] = [];

  @Input() set initial(val: boolean) {
    if(val) {
      this.createChartLine();
    }
  }

  @Input() set ticks(ticks: any[]) {
    if(!this.chart) {
      this.pendingTicks = ticks
    } else {
      this.modidyChart(ticks)
      this.pendingTicks = []
    }
    // ticks.forEach((tick: any) => {
    // })
  }

  constructor(public cs: ChartJSService, private cdRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {

  }

  public ngAfterViewInit(): void {
    // this.createChartLine();
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private createChartLine(): void {
    this.chart = Highcharts.chart('chart-line', {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Multi-line Chart',
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: 'Percentage',
          type: 'number'
        }
      },
      xAxis: {
        type: 'category',
        categories: this.getXCategories()
      },
      tooltip: {
        headerFormat: `<div>Date: {point.key}</div>`,
        pointFormat: `<div>{series.name}: {point.y}</div>`,
        shared: true,
        useHTML: true,
      },
      series: this.getChartSeries(),
    } as any);
  }

  chartSeries: any[] = [];
  getChartSeries(ticks: any[] = this.pendingTicks): any[] {
    let res: any[] = []
    ticks.forEach((tick: any) => {
      res.push({
        name: tick.name,
        data: tick.values.map((x: any) => [x.time, x.percentChange]),
      })
    })
    this.chartSeries = res;
    console.log(res[0])
    debugger
    return res
  }

  modidyChart(ticks: any[]) {
    ticks.forEach((tick: any) => {
      // let item = this.chartSeries.find((el: any) => el?.name == tick.name)
      let item: any = this.chart.series.find((el: any) => el?.userOptions?.name == tick.name)
      if (item) {
        // item.values = item.data.values.concat(tick.values);
        tick.values.forEach((element: any) => {
          item.addPoint([element.time, element.percentChange], true, true);
        });
      } else {
        this.chart.addSeries({
          type: 'line',
            name: tick.name,
            data: tick.values.map((v: any) => [v.time, v.percentChange])
        })
        this.chartSeries.push(item);
      }
    });
    debugger
    this.getXCategories(ticks)
    this.chart.xAxis[0].setCategories(this.xCategories);
    this.cdRef.detectChanges();
  }

  xCategories: any[] = []
  getXCategories(ticks: any[] = this.pendingTicks): any[] {
    const uniqueArray: any[] = [];
    ticks[ticks.length-1].values.forEach((value: any) => {
      if (!uniqueArray.some(item => item === value.time)) {
        uniqueArray.push(value.time);
        this.xCategories.push(value.time);
      }
    });
    return uniqueArray
  }
}