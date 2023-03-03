import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RippleModule } from 'primeng/ripple';
import {RouterModule} from '@angular/router';

import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RessourceService } from './ressourceService';
import { ProjectService } from './projectservice';

import { AppComponent } from './app.component';


import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {InputTextModule} from 'primeng/inputtext';
import {KnobModule} from 'primeng/knob';


import {RatingModule} from 'primeng/rating';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RippleModule,
    TableModule,
    CalendarModule,
		SliderModule,
		DialogModule,
		MultiSelectModule,
		ContextMenuModule,
		DropdownModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    ProgressBarModule,
    HttpClientModule,
    FormsModule,
    RatingModule,
    KnobModule,
    RouterModule.forRoot([
      {path:'',component: AppComponent}

		])
    
  ],
  providers: [RessourceService,ProjectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
