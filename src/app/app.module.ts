import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { BlocklyComponent } from './blockly/blockly.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxBlocklyModule} from 'ngx-blockly';
import { NgxBlocklyComponent } from './ngx-blockly/ngx-blockly.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { DataDisplayComponent } from './data-display/data-display.component';
import {MatListModule} from '@angular/material/list';
import { ChartsModule, WavesModule } from 'angular-bootstrap-md';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {MatRadioModule} from '@angular/material/radio';
import { SidenavComponent } from './sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SearchPatternComponent } from './search-pattern/search-pattern.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {DataSearchPipe} from './data-display/filter.pipe';
import {MatTableModule} from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

const material = [
  MatTabsModule,
  MatInputModule,
  MatCardModule,
  MatFormFieldModule,
  MatButtonModule,
  MatSelectModule,
  MatProgressBarModule,
  MatIconModule
];
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    BlocklyComponent,
    NgxBlocklyComponent,
    DataDisplayComponent,
    SidenavComponent,
    SearchPatternComponent,
    DataSearchPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    ChartsModule,
    WavesModule,
    NgxBlocklyModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    MatRadioModule,
    MatSidenavModule,
    MatSelectModule,
    MatToolbarModule,
    MatAutocompleteModule,
    FlexLayoutModule,
    MatTableModule,
    AppRoutingModule,
  ],
  exports: [
    MainComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
