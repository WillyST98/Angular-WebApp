import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';
import { map } from  'rxjs/operators';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  // SERVER_URL: string = "https://file.io/";
  REQUEST_NEW_MINING_SERVER_URL: string = environment.apiEndpoint + '/qmine/invoke';
  CHECK_STATUS_URL: string = environment.apiEndpoint + '/qmine/status/request/';
  constructor(private httpClient: HttpClient) { }

  public upload(formData) {
    var URL = this.REQUEST_NEW_MINING_SERVER_URL + '?pattern=' + formData.get('pattern') + '&event_length=' + formData.get('event_length');
    return this.httpClient.post<any>(URL, formData);
  }

  public getStatus(requestId) {
    var URL = this.CHECK_STATUS_URL + requestId;
    return this.httpClient.get(URL);
  }
}
