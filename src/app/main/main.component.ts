import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProcessDataService} from '../process-data.service';
import {responseFromAPI} from '../response';

declare var Blockly: any;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'multipart/form-data'
  })
};
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  public responseData: responseFromAPI[] = [];
  public chartType: string = 'bar';
  public chartData: any = [];
  public mainDisplay: string = 'primaryData';
  workspace: any;
  regexInput = '';
  regexOutput = '';
  url = 'https://run.mocky.io/v3/dc1e9afe-5ede-41a6-bb02-52271023e64a';
  private submitted: boolean;
  regexGraph = '';
  constructor(private http: HttpClient, private processDataService: ProcessDataService) {
  }

  ngOnInit(): void {
    this.workspace = Blockly.inject('blocklyDiv', {
      toolbox: document.getElementById('toolbox'),
      scrollbars: false
    });
  }

  processInput(): void {
  //  TO DO IMPLEMENT METHOD TO PROCESS INPUT
  //   this.processDataService.getResponse(this.regexInput)
  //     .subscribe(data => this.responseData = data);

    var data = this.processDataService.getResponse(this.regexInput);
    for (let i of data.match) {
      for ( let y of i.value) {
        let newInput:responseFromAPI = {pattern: i.pattern, value1: y[0], value2: y[1]};
        this.chartData.push(newInput);
      }
    }
    this.processValue(this.chartData);
    console.log(this.chartData);
    this.regexOutput = this.regexInput.concat(' was your input');

    // this.http.post(this.url, {data: this.regexInput}, httpOptions).subscribe({
    //   next: data => console.log(data),
    //   error: error => console.error('there was an error!', error)
    // });
    // this.http.get(this.url).toPromise().then(data => {
    //   console.log(data);
    // });



  }

  processValue(input: responseFromAPI[]) {
    var currentPattern = input[0].pattern;
    var currentTotalValue1 = 0;
    var currentTotalValue2 = 0;
    var currentCount = 0;
    var totalCount = 0;
    this.chartData = [];
    for (let i of input) {
      totalCount++;
      if (currentPattern === i.pattern) {
          currentTotalValue1 += i.value1;
          currentTotalValue2 += i.value2;
          currentCount++;
      }
      // this if block exists to when the situation is at the end of the input array, there's a new pattern which only occurs once. Thus you have to input the current pattern into the dataset and immediately after
      // input the last pattern into the data array.
      else if (totalCount === input.length) {
        this.chartData.push({pattern: currentPattern, value1: (currentTotalValue1) / currentCount, value2: currentTotalValue2 / currentCount});
        this.chartData.push({pattern: i.pattern, value1: i.value1, value2: i.value2});
      }
      else {
        this.chartData.push({pattern: currentPattern, value1: (currentTotalValue1) / currentCount, value2: currentTotalValue2 / currentCount});
        currentPattern = i.pattern;
        currentTotalValue1 = i.value1;
        currentTotalValue2 = i.value2;
        currentCount = 1;
      }

    }
  }
  switchDisplay(input: string): void {
    this.mainDisplay = input;
  }
}
