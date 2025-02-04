import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarWrapperComponent } from './shared/plugins/snackbar/components/snackbar-wrapper/snackbar-wrapper.component';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SnackbarWrapperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private _document: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private analytics: Analytics
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.injectScripts();
    }
  }

  injectScripts() {
    const gtmId = environment.firebaseConfig.measurementId;
    const gtmScriptTag = this.renderer.createElement('script');
    gtmScriptTag.type = 'text/javascript';
    gtmScriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${gtmId}`;
    this.renderer.appendChild(this._document.head, gtmScriptTag);

    const gtagInitScript = this.renderer.createElement('script');
    gtagInitScript.type = 'text/javascript';
    gtagInitScript.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', '${gtmId}');
    `;
    this.renderer.appendChild(this._document.head, gtagInitScript);
  }

  ngOnInit() {
    // if (isPlatformBrowser(this.platformId)) {
    //   this.trackTestEvent();
    // }
  }

  // trackTestEvent() {
  //   logEvent(this.analytics, 'test_event', { test_param: 'hello world' });
  // }
}
