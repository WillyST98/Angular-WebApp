import { Component, OnInit } from '@angular/core';
import {ProcessDataService} from '../process-data.service';
import {responseFromAPI} from '../response';
import {MatSelectionListChange} from '@angular/material/list';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-search-pattern',
  templateUrl: './search-pattern.component.html',
  styleUrls: ['./search-pattern.component.css']
})
export class SearchPatternComponent implements OnInit {
  workspace: any;
  regexInput = '';
  regexOutput = '';
  url = 'https://run.mocky.io/v3/dc1e9afe-5ede-41a6-bb02-52271023e64a';
  private submitted: boolean;
  regexGraph = '';
  mainDisplay: string = 'primaryData';
  constructor(private http: HttpClient, private processDataService: ProcessDataService) { }

  ngOnInit(): void {
  }
  processInput(): void {
    this.regexOutput = this.regexInput.concat(' was your input');

  }

}
