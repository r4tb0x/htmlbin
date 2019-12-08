import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { ViewerComponent } from './viewer/viewer.component';
import { UploadComponent } from './upload/upload.component';
import { EncryptionService } from './encryption.service';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    ViewerComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [EncryptionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
