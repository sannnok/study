import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, OnInit } from '@angular/core';
//import { AgmCoreModule } from '@agm/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {


  lat: number = 47.049971;
  lng: number = 28.869012;

  constructor() { }

  ngOnInit() {
  	// Здесь можно выполнять загрузку данных с сервера или из других источников данных.
  }

}

// @NgModule({
//   imports: [
//     BrowserModule,
//     AgmCoreModule.forRoot({
//       apiKey: 'AIzaSyAVa3B9POexu_zr1dZsL-2m-A88N7e4j0o&callback'
//     })
//   ],
//   declarations: [ ContactComponent ],
//   bootstrap: [ ContactComponent ]
// })

// export class AppModule { }
