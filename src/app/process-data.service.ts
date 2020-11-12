import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {responseFromAPI} from './response';
import {rawResponse} from './rawResponse';
import {Observable, throwError} from 'rxjs';
import {environment} from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'multipart/form-data'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProcessDataService {
  private GET_DATA_URL = 'https://run.mocky.io/v3/38864020-a134-46da-b52f-c2c376c5d829';
  // GET_DATA_URL: string = environment.apiEndpoint + '/qmine/getresult/request/';
  constructor(private http: HttpClient) { }

  getResponse(requestId) {
    // var URL = this.GET_DATA_URL + requestId;
    var URL = this.GET_DATA_URL;
    return this.http.get(URL);
    // var test = this.http.get<rawResponse>(this.url);
    // var res = {
    //   count: 3,
    //   match: [{
    //     pattern: 'p[0-9]+m[0-9]+b',
    //     value: [
    //       [
    //         47793, 85386, 1231
    //       ],
    //       [
    //         47732, 123, 4451
    //       ],
    //     ]
    //   },
    //     {
    //       pattern: 'b[0-9]+h[0-9]+t',
    //       value: [
    //         [
    //           16649, 2362, 33131
    //         ],
    //         [
    //           47732, 123, 12313
    //         ],
    //
    //       ]
    //     },
    //     {
    //       pattern: 'm[0-9]+b[0-9]+h',
    //       value: [
    //         [
    //           85386, 16649, 123341
    //         ],
    //         [
    //           42131, 1235, 123123
    //         ],
    //       ]
    //     }
    //   ]
    // };
    // return test;
  }
}
