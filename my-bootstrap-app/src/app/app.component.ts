import { Component } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { UserService } from './user.service';

//import {SharedService} from '../shared.service';
//import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http:Http, private user: UserService){}

  ngOnInit() {
    this.user.getUserLoggedIn();
  }
}

