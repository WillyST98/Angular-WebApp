import {Component, OnInit, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  showSideNav: boolean = false;
  @Output() switchEvent = new EventEmitter<string>();
  private fileToUpload: File;

  constructor() { }

  ngOnInit(): void {
  }
  public switchDisplay(input: string): void {
    this.switchEvent.emit(input);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
}
