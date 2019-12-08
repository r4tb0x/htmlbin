import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../encryption.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit, OnDestroy {

  fileName: string = '';
  password: string = '';
  decryptedText: string = '';
  fileType: string = '';
  documentHTML: SafeHtml = null;
  errorMessage: string = null;
  isLoading: boolean = true;
  siteUrl: string = '';
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private encryptionService: EncryptionService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnDestroy() {}
  ngOnInit() {
    this.siteUrl = window.location.origin + '/';
    this.errorMessage = null;
    this.route.paramMap.subscribe(params => {
      this.fileName = params.get('fileName') && params.get('fileName').length ? params.get('fileName').trim() : '';
      this.password = params.get('password') && params.get('password').length ? params.get('password').trim() : '';
      if (!this.fileName || this.fileName.length <= 0 || !this.password || this.password.length <= 0) {
        this.errorMessage = 'Sorry, something went wrong here! Possible reason: broken link.';
      } else {
        this.http.get(this.siteUrl+'uploads/'+this.fileName+'.json?nocache='+(new Date().getTime())).subscribe((answer: any) => {
          if (answer && answer.type && answer.data) {
            try {
              this.decryptedText = this.encryptionService.decrypt(answer.data, this.password);
              if (answer.type === 'html' || answer.type === 'document') {
                this.documentHTML = this.sanitizer.bypassSecurityTrustHtml(this.decryptedText);
              }
              this.isLoading = false;
              this.fileType = answer.type;
            } catch (e) {
              this.isLoading = false;
              this.errorMessage = 'Sorry, something went wrong here! Possible reason: broken link.';
            }
          } else {
            this.isLoading = false;
            this.errorMessage = 'Sorry, something went wrong here! Possible reason: broken link or missing file.';
          }
        }, (error: any) => {
          this.isLoading = false;
          this.errorMessage = 'Sorry, something went wrong here! Possible reason: broken link or missing file.';
        });
      }
    });
  }
}
