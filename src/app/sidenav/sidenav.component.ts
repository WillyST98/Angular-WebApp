import {Component, OnInit, EventEmitter, Output, ViewChild, ElementRef} from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UploadService} from  '../upload.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../dialog/dialog.component';

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
  pattern: string = '';
  customPattern1: string = '0M1';
  customPattern2: string = '0M1M2';
  customPattern3: string = '0M1M2M3';
  requestID: string;
  filePreview: boolean = false;
  checkStatusCounter = 0;
  @Output() requestIdEvent = new EventEmitter<string>();
  @Output() patternEvent = new EventEmitter<string>();
  status: string = '1';
  fileToUploadPreview: File;

  constructor(private uploadService: UploadService, public dialog: MatDialog) { }

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
    }
    );
  }

  public openDialog(toolTipContent: string) {
    this.dialog.open(DialogComponent, {data: {content: toolTipContent}});
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
        this.patternEvent.emit(this.pattern);
      }
      if (this.patternToMineFor == 'Pattern 1') {
        this.uploadFiles(this.customPattern1, this.eventLength);
        this.patternEvent.emit(this.customPattern1);
      }
      if (this.patternToMineFor == 'Pattern 2') {
        this.uploadFiles(this.customPattern2, this.eventLength);
        this.patternEvent.emit(this.customPattern2);
      }
      if (this.patternToMineFor == 'Pattern 3') {
        this.uploadFiles(this.customPattern3, this.eventLength);
        this.patternEvent.emit(this.customPattern3);
      }
    };
    fileUpload.click();
  }

  onClickNoUpload() {
    const fileUpload = this.fileUpload.nativeElement;
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
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  previewFile() {
    let fileReader = new FileReader();
    var fileContent = '';
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      fileContent = fileReader.result;
      this.dialog.open(DialogComponent, {data: {content: fileContent}});
    };
    fileReader.readAsText(this.fileToUploadPreview);
  }

  changeListener($event): void {
    this.filePreview = true;
    this.fileToUploadPreview = $event.target.files[0];
    console.log(this.fileToUploadPreview);
  }
}
