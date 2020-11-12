import {Component, OnInit, EventEmitter, Output, ViewChild, ElementRef} from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UploadService} from  '../upload.service';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef; files = [];
  showSideNav: boolean = false;
  @Output() switchEvent = new EventEmitter<string>();
  private fileToUpload: File;
  patternToMineFor: string = 'Pattern 1';
  eventLength: number;
  pattern: string = 'p[0-9]';
  customPattern1: string = '0M1';
  customPattern2: string = '0M2';
  customPattern3: string = '0M3';
  requestID: string;
  checkStatusCounter = 0;
  @Output() requestIdEvent = new EventEmitter<string>();
  status: string = '1';

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
  }
  public switchDisplay(input: string): void {
    this.switchEvent.emit(input);
  }
  //  sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  /**
   * This function will call call the API to start a new mining request at the server which will return a requestId which can be used to check for progress.
   * it will be saved in the requestId parameter
   * @param file = the file to mine the data from
   * @param pattern = the pattern to mine for
   * @param eventLength = the event length of the pattern
   */

  // public checkRequest(requestId) {
  //   this.uploadService.getStatus(requestId).subscribe(response => {this.status = response.status});
  // }

  public checkRequest(requestId) {
    return new Promise<any>(((resolve, reject) => {
      this.uploadService.getStatus(requestId).subscribe(response => {
        this.status = response.status
        resolve();
      });
    }));
  }

  public checkRequestAwait(requestID) {
    return new Promise<any>(((resolve, reject) => {
      setTimeout(
        () => {
          this.checkRequest(requestID);
          resolve();
        }, 5000
      );
    }));
  }

  public async updateRequestStatus(requestID) {
    // while(true) {
    //   await this.checkRequestAwait(requestID);
    //   if (this.status == '3') {
    //     confirm('Error, please retry the upload');
    //     this.checkStatusCounter = 0;
    //     return;
    //   }
    //   else if (this.status == '2') {
    //     this.checkStatusCounter = 0;
    //     this.requestIdEvent.emit(this.requestID);
    //     this.switchEvent.emit('primaryData');
    //     return;
    //   }
    // }

    while(true) {
      //await this.checkRequestAwait(requestID);
      await this.checkRequest(requestID);
      console.log(this.status);
      if (this.status == '3') {
        confirm('Error, please retry the upload');
        this.checkStatusCounter = 0;
        return;
      } else if (this.status == '2') {
        this.checkStatusCounter = 0;
        return;
      }
      await this.sleep(5000);
    }

    }

  public uploadFile(file, pattern, eventLength) {
    var formData = new FormData();
    formData.append('input_file', file.data);
    formData.append('pattern', pattern);
    formData.append('event_length', eventLength);
    file.inProgress = true;
    this.uploadService.upload(formData).subscribe(async response => {this.requestID = response.requestId,
        this.switchEvent.emit('mining');
    var localStatus = this.status;
    await this.updateRequestStatus(this.requestID);
    if (this.status == '2') {
      this.requestIdEvent.emit(this.requestID);
      this.switchEvent.emit('primaryData');
    }
    console.log(this.status);
    // while (this.status !== '2' || this.checkStatusCounter == 5) {
    //   this.checkRequest(this.requestID);
    //   console.log('ran');
    //   this.sleep(10000);
    //   this.checkStatusCounter++;
    // }
        // while(this.status != 2) {
        //   this.sleep(2000);
        //   this.checkRequest(this.requestID);
        //   this.sleep(2000);
        //   if (this.status == 3) {
        //     confirm('Error, please retry the upload');
        //     return;
        //   }
        //   else if (this.status == 1) {
        //     this.checkRequest(this.requestID);
        //   }
        // }
    }
    );
    // this.uploadService.upload(formData).pipe(
    //   map(event => {
    //     switch (event.type) {
    //       case HttpEventType.UploadProgress:
    //         file.progress = Math.round(event.loaded * 100 / event.total);
    //         break;
    //       case HttpEventType.Response:
    //         return event;
    //     }
    //   }),
    //   catchError((error: HttpErrorResponse) => {
    //     file.inProgress = false;
    //     console.log(error);
    //     return of(`${file.data.name} upload failed.`);
    //   })).subscribe(response => {this.requestID = response,
    //   console.log(this.requestID); }
    // );
  }

  /**
   * This function calls the uploadFile for each pattern that the user submits
   * @param pattern = the pattern that you want to mine for
   * @param eventLength = the event length of the pattern
   */
  private uploadFiles(pattern, eventLength) {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.uploadFile(file, pattern, eventLength);
    });
  }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++)
      {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0});
      }
      if (this.patternToMineFor == 'Custom') {
        this.uploadFiles(this.pattern, this.eventLength);
      }
      if (this.patternToMineFor == 'Pattern 1') {
        this.uploadFiles(this.customPattern1, this.eventLength);
      }
      if (this.patternToMineFor == 'Pattern 2') {
        this.uploadFiles(this.customPattern2, this.eventLength);
      }
      if (this.patternToMineFor == 'Pattern 3') {
        this.uploadFiles(this.customPattern3, this.eventLength);
      }
    };
    fileUpload.click();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
}
