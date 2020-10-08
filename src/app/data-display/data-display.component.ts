import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ProcessDataService} from '../process-data.service';
import {responseFromAPI} from '../response';
import  {chartDataFormat} from '../chartDataFormat';
import {MatSelectionListChange} from '@angular/material/list';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, max, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.css']
})
export class DataDisplayComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  selectedValues: responseFromAPI[] = [];
  displayGraph = false;
  displayError = false;
  public dataType = "average";
  public lastPattern = '';
  public responseData: responseFromAPI[] = [];
  public chartPattern: string[] = [];
  public chartData: responseFromAPI[] = [];
  public chartDataAvg: responseFromAPI[] = [];
  public chartValue: Array<any> = [];
  public chartLabels: Array<string> = [];
  public chartType: string[] = [];
  public maxCount: number = 0;
  public maxCountPattern: string;
  public maxValue1: number = 0;
  public maxValue1Pattern: string;
  public maxValue2: number = 0;
  public maxValue2Pattern: string;
  public minValue1: number = 1000000;
  public minValue1Pattern: string;
  public minValue2: number = 1000000;
  public minValue2Pattern: string;
  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  displayedColumns: string[] = ['selected', 'pattern'];

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }


  constructor(private processDataService: ProcessDataService) {
  }

  ngOnInit(): void {
    var data = this.processDataService.getResponse();
    for (let i of data.match) {
      for (let y of i.value) {
        let newInput: responseFromAPI = {pattern: i.pattern, value: y, value1: y[0], value2: y[1]};
        this.chartData.push(newInput);
      }
    }
    this.processValue(this.chartData);
    this.createPatternArray(this.chartData);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.populateChartDataInitialize();
    this.generateColumnList();
    this.addCheckBox();
  }

  private _filter(value: string): string[] {
    const filteredValue = value.toLowerCase();
    return this.chartPattern.filter(option =>
      option.toLowerCase().includes(filteredValue)
    );
  }

  /**
   * This function takes the input and produces 2 array. chartDataAvg and chartData.
   * chartDataAvg will be used to supply data to the chart
   * chartData will be used to supply data to the table
   * the difference between them is chartDataAvg will only have entry for each unique pattern, and have all their avg, min, max, SD
   * chartData will contain all instance of a pattern to display on the table
   * @param input
   */
  processValue(input: responseFromAPI[]): void {
    var currentPattern = input[0].pattern;
    var currentValue = [...input[0].value];
    var currentAvgTotalValue = [...input[0].value];
    var currentCount = 0;
    var totalCount = 0;
    var currentMax = [...input[0].value];
    var currentMin = [...input[0].value];
    this.chartData = [];
    for (let i of input) {
      totalCount++;
      if (currentPattern === i.pattern) {
        if (totalCount > 1) {
          for (let y in currentAvgTotalValue) {
            currentAvgTotalValue[y] = currentAvgTotalValue[y] + i.value[y];
            if (currentMax[y] < i.value[y]) {
              currentMax[y] = i.value[y];
            }
            if (currentMin[y] > i.value[y]) {
              currentMin[y] = i.value[y];
            }
          }
        }
        currentValue = [...i.value];
        currentCount++;
        if (this.maxCount < currentCount) {
          this.maxCount = currentCount;
          this.maxCountPattern = currentPattern;
        }
        this.chartData.push({
          pattern: currentPattern,
          value: currentValue
        });
        if (totalCount === input.length) {
          for (let y in currentAvgTotalValue) {
            currentAvgTotalValue[y] = currentAvgTotalValue[y] / currentCount;
          }
          this.chartDataAvg.push({
            pattern: currentPattern,
            avgValue: currentAvgTotalValue,
            min: currentMin,
            max: currentMax
          });
        }
      }
        // this if block exists to when the situation is at the end of the input array, there's a new pattern which only occurs once. Thus you have to input the current pattern into the dataset and immediately after
      // input the last pattern into the data array.
      else if (totalCount === input.length) {
        for (let y in currentAvgTotalValue) {
          currentAvgTotalValue[y] = currentAvgTotalValue[y] / currentCount;
        }
        this.chartDataAvg.push({
          pattern: currentPattern,
          avgValue: currentAvgTotalValue,
          min: currentMin,
          max: currentMax
        });
        this.chartData.push({pattern: i.pattern, value: i.value});
        this.chartDataAvg.push({pattern: i.pattern, avgValue: i.value, min: i.value, max: i.value});
      } else {
        for (let y in currentAvgTotalValue) {
          currentAvgTotalValue[y] = currentAvgTotalValue[y] / currentCount;
        }
        this.chartDataAvg.push({
          pattern: currentPattern,
          avgValue: currentAvgTotalValue,
          min: currentMin,
          max: currentMax
        });
        currentPattern = i.pattern;
        currentValue = [...i.value];
        currentAvgTotalValue = [...i.value];
        currentMax = [...i.value];
        currentMin = [...i.value];
        currentCount = 1;
        this.chartData.push({
          pattern: currentPattern,
          value: currentValue
        });
      }
    }
    this.generateSD();
  }

  /**
   * this function is run to generate standard deviation for all the chartDataAvg values
   * currentSD will be an array that holds the sum of the difference of each value and the mean
   * currentPattern will hold the pattern of the data that is currently being worked on
   * currentchartDataAvgCounter will be the iterator for the chartDataAvg, used only to push the SD values into it
   * needToInput is a boolean that is used to tell the algorithm to add the SD into chartDataAvg as the next pattern will be a new one
   * currentPatternLength is used to determine the number of hits with pattern x/
   * currentSDToBePushed will be a single dimensional array that will be pushed to the chartDataAvg SD property
   */
  generateSD() {
    var currentSD: number[][] = new Array(this.chartData.length);
    var flag = true;
    for (let i = 0; i < this.chartData.length; i++) {
      currentSD[i] = new Array(this.chartDataAvg[0].avgValue.length);
      for (var z = 0; z < currentSD[i].length; z++) {
        currentSD[i][z] = 0;
      }
    }
    var currentPattern = this.chartData[0].pattern;
    var currentchartDataAvgCounter = 0;
    var needToInput = false;
    var currentPatternLength = 0;
    var currentSDToBePushed: number[] = new Array(this.chartDataAvg[0].avgValue.length);
    for (var i = 0; i < currentSDToBePushed.length; i++) {
      currentSDToBePushed[i] = 0;
    }
    for (let i in this.chartData) {
      for (let y in this.chartDataAvg[0].avgValue) {
        if (this.chartData[i].pattern === currentPattern) {
          currentSD[i][y] = Math.pow((this.chartData[i].value[y] - this.chartDataAvg[currentchartDataAvgCounter].avgValue[y]), 2);
          if (+i === this.chartData.length - 1) {
            for (let z = +i - currentPatternLength; z <= +i; z++) {
              currentSDToBePushed[y] += currentSD[z][y];
            }
            needToInput = true;
          }
        } else {
          for (let z = +i - currentPatternLength; z < +i; z++) {
            currentSDToBePushed[y] += currentSD[z][y];
          }
          needToInput = true;
        }
      }
      if (needToInput) {
        needToInput = false;
        for (let z in currentSDToBePushed) {
          currentSDToBePushed[z] /= currentPatternLength;
          currentSDToBePushed[z] = Math.sqrt(currentSDToBePushed[z]);
        }
        this.chartDataAvg[currentchartDataAvgCounter].SD = currentSDToBePushed;
        currentPatternLength = 0;
        currentSDToBePushed = new Array(this.chartDataAvg[0].avgValue.length);
        for (var d = 0; d < currentSDToBePushed.length; d++) {
          currentSDToBePushed[d] = 0;
        }
        currentchartDataAvgCounter++;
        if (currentchartDataAvgCounter < this.chartDataAvg.length) {
          currentPattern = this.chartDataAvg[currentchartDataAvgCounter].pattern;
        }
      }
      currentPatternLength++;
    }
    console.log(this.chartDataAvg);
  }

  /**
   * This function generates the column names for the table e.g value0, value1, etc
   */
  generateColumnList() {
    for (let i in this.chartDataAvg[0].avgValue) {
      this.displayedColumns.push('value'.concat(i.toString()));
    }
  }

  /**
   * This function will generate the chart data for the data that has been selected. It will empty the chartLabels and chartValue
   * and also calculate the average for the data that has been selected
   * chartLabels and chartValue are some of the input required to produce the chart
   * chartLabels hold the pattern array for the chart
   * chartValue will be the actual data for the chart
   * currentSum will be used to sum the data together so that it can be divided by currentCounter, which counts the number of data
   */
  populateChartData() {
    // if (this.chartLabels.includes(this.selectedValues[0].pattern)) {
    //   return;
    // }
    this.chartLabels = [];
    this.chartValue = [];
    // for (let i = 0; i < this.selectedValues.length; i++) {
    //   this.chartValue[i] = new Array(this.chartDataAvg[0].avgValue.length);
    //   for (var z = 0; z < this.chartValue[i].length; z++) {
    //     this.chartValue[i][z] = 0;
    //   }
    // }
    var currentColumn = 0;
    var chartDataToBePushed = [];
    for (let i in this.selectedValues) {
      if (this.chartLabels.includes(this.selectedValues[i].pattern)) {
        return;
      }
      this.chartLabels.push(this.selectedValues[i].pattern);
    }
    for (let i in this.chartDataAvg[0].avgValue) {
      if (this.dataType === 'average') {
        if (this.chartDataAvg[i].avgValue) {
          for (let y = 0; y < this.chartDataAvg.length; y++) {
            if (this.chartDataAvg[y].avgValue[currentColumn]) {
              chartDataToBePushed.push(this.chartDataAvg[y].avgValue[currentColumn]);
            } else {
              return;
            }
          }
          this.chartValue.push([{data: chartDataToBePushed, label: 'Value '.concat(i)}]);
        }
      } else if (this.dataType === 'min') {
        if (this.chartDataAvg[i].min) {
          for (let y = 0; y < this.chartDataAvg.length; y++) {
            if (this.chartDataAvg[y].min[currentColumn]) {
              chartDataToBePushed.push(this.chartDataAvg[y].min[currentColumn]);
            } else {
              return;
            }
          }
          this.chartValue.push([{data: chartDataToBePushed, label: 'Value '.concat(i)}]);
        }
      } else if (this.dataType === 'max') {
        if (this.chartDataAvg[i].max) {
          for (let y = 0; y < this.chartDataAvg.length; y++) {
            if (this.chartDataAvg[y].max[currentColumn]) {
              chartDataToBePushed.push(this.chartDataAvg[y].max[currentColumn]);
            } else {
              return;
            }
          }
          this.chartValue.push([{data: chartDataToBePushed, label: 'Value '.concat(i)}]);
        }
      } else if (this.dataType === 'SD') {
        if (this.chartDataAvg[i].SD) {
          for (let y = 0; y < this.chartDataAvg.length; y++) {
            if (this.chartDataAvg[y].SD[currentColumn]) {
              chartDataToBePushed.push(this.chartDataAvg[y].SD[currentColumn]);
            } else {
              return;
            }
          }
          this.chartValue.push([{data: chartDataToBePushed, label: 'Value '.concat(i)}]);
        }
      }
      this.chartType.push('bar');
      chartDataToBePushed = [];
      currentColumn++;
    }
  }
  /**
   * Exactly the same as above, but this one checks the value from chartDataAvg, which basically means it inserts all the available data
   * at the start. This function also checks for the max, min, and max count pattern for the top cards in the dashboard. This is obsolete
   * and will be removed later.
   * DONT DELETE NEXT CODE BLOCK (IF WE WANT TO AVERAGE THE RESULTS TOGETHER (GET SINGLE CHART INSTEAD OF CHART PER VALUE)
   */
  // populateChartDataInitialize() {
  //   this.chartLabels = [];
  //   this.chartValue = [];
  //   var currentSum = 0;
  //   var currentCounter = 0;
  //   for (let i of this.chartDataAvg) {
  //     this.chartLabels.push(i.pattern);
  //     for (let y of i.avgValue) {
  //       currentSum += y;
  //
  //       if ((y > this.maxValue1) && currentCounter === 0) {
  //         this.maxValue1 = y;
  //         this.maxValue1Pattern = i.pattern;
  //       }
  //       if (i.value2 > this.maxValue2) {
  //         this.maxValue2 = i.value2;
  //         this.maxValue2Pattern = i.pattern;
  //       }
  //       if (y < this.minValue1 && currentCounter === 0) {
  //         this.minValue1 = y;
  //         this.minValue1Pattern = i.pattern;
  //       }
  //       if (i.value2 < this.minValue2) {
  //         this.minValue2 = i.value2;
  //         this.minValue2Pattern = i.pattern;
  //       }
  //       currentCounter++;
  //     }
  //     this.chartValue.push(currentSum / currentCounter);
  //     currentSum = 0;
  //     currentCounter = 0;
  //   }
  //   this.chartValue = [{data: this.chartValue, label: 'data1'}];
  // }

  populateChartDataInitialize() {
    this.chartLabels = [];
    this.chartValue = [];
    this.chartType = [];
    var currentColumn = 0;
    var chartDataToBePushed = [];
    for (let i in this.chartDataAvg) {
      if (this.chartLabels.includes(this.chartDataAvg[i].pattern)) {
        return;
      }
      this.chartLabels.push(this.chartDataAvg[i].pattern);
      if (this.dataType === 'average') {
        if (this.chartDataAvg[i].avgValue) {
          for (let y = 0; y < this.chartDataAvg.length; y++) {
            if (this.chartDataAvg[y].avgValue[currentColumn]) {
              chartDataToBePushed.push(this.chartDataAvg[y].avgValue[currentColumn]);
            } else  {
              return;
            }
          }
          this.chartValue.push([{data: chartDataToBePushed, label: 'Value '.concat(i)}]);
          this.chartType.push('bar');
          chartDataToBePushed = [];
        }
      } else if (this.dataType === 'min') {
        if (this.chartDataAvg[i].min) {
          for (let y = 0; y < this.chartDataAvg.length; y++) {
            if (this.chartDataAvg[y].min[currentColumn]) {
              chartDataToBePushed.push(this.chartDataAvg[y].min[currentColumn]);
            } else  {
              return;
            }
          }
          this.chartValue.push([{data: chartDataToBePushed, label: 'Value '.concat(i)}]);
          this.chartType.push('bar');
          chartDataToBePushed = [];
        }
      }
      currentColumn++;
    }
    console.log(this.chartValue);
  }


  /**
   * this will create the array of pattern from the input
   * @param chartData: the data that will be used to take the pattern from
   */
  createPatternArray(chartData: responseFromAPI[]) {
    for (let i of chartData) {
      this.chartPattern.push(i.pattern);
    }
  }

  /**
   * this function will add the checkbox property to the chartData. It will do so for the first instance of a unique pattern
   * This is so that the checkbox will only be displayed on the table only for every unique pattern
   */
  private addCheckBox() {
    for (let i of this.chartData) {
      if (i.pattern != this.lastPattern) {
        i.checkbox = true;
        this.lastPattern = i.pattern;
      }
    }
  }
  private foo() {

  }

  // addIntoChart(element: responseFromAPI) {
  //   var currentSum = 0;
  //   var currentCount = 0;
  //   var newData = this.chartValue[0].data;
  //   if (this.chartLabels.includes(element.pattern)) {
  //     const toDelete = this.chartLabels.indexOf(element.pattern);
  //     this.chartLabels.splice(toDelete, 1);
  //     this.chartValue[0].data.splice(toDelete, 1);
  //   } else if (element.checkbox) {
  //     this.chartLabels.push(element.pattern);
  //     for (let i of element.avgValue) {
  //       currentSum += i;
  //       currentCount++;
  //       newData.push(currentSum / currentCount);
  //     }
  //     currentCount = 0;
  //     currentSum = 0;
  //     this.chartValue = [{data: newData, label: 'data1'}];
  //   }
  // }
}
