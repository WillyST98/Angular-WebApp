import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {responseFromAPI} from './response';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'multipart/form-data'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProcessDataService {
  private url = 'https://run.mocky.io/v3/dc1e9afe-5ede-41a6-bb02-52271023e64a';
  constructor(private http: HttpClient) { }

  getResponse(input?: string) {
    // var res = this.http.get<responseFromAPI[]>(this.url, httpOptions );
    // console.log('res' + JSON.stringify(res));
    // tslint:disable-next-line:prefer-const
    var res = {
      count: 3,
      match: [{
        pattern: 'p[0-9]+m[0-9]+b',
        value: [
          [
            47793, 85386, 1231
          ],
          [
            47732, 123, 4451
          ],
        ]
      },
        {
          pattern: 'b[0-9]+h[0-9]+t',
          value: [
            [
              16649, 2362, 33131
            ],
            [
              47732, 123, 12313
            ],

          ]
        },
        {
          pattern: 'm[0-9]+b[0-9]+h',
          value: [
            [
              85386, 16649, 123341
            ],
            [
              42131, 1235, 123123
            ],
          ]
        }
      ]
    };
    return res;
  }
}
