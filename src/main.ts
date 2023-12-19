import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  if (environment.production) {
    enableProdMode();
  }
  
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(HttpClientModule),
      importProvidersFrom(
        HttpClientXsrfModule.withOptions({
          cookieName: 'csrftoken',
          headerName: 'X-CSRFToken', 
        })
      ),
    ],
  }).catch(err => console.error(err));
  