import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, ChartsModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [ AppService ],
})
export class AppModule { }
