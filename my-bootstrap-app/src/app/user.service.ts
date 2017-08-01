import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  

  private isUserLoggedIn;
  private username;
  private userid;

  constructor(private http:Http) { 
  	this.isUserLoggedIn = false;
  }

  setUserLoggedIn(username: string, id:string){
  	this.isUserLoggedIn = true;
  	this.username = username;// Достаем из БД
  	this.userid = id;
  }

  getUserLoggedIn(){
  	return this.isUserLoggedIn;
  }
  getUserId(){
  	return this.userid;
  }


    ngrok :string = "8fabfbab"
  //   post(){
  //   this.http
  //     .post("http://"+ this.ngrok+".ngrok.io/getTestAngular?Param=")
  //     .toPromise()
  //     .then(res => this.httpSuccess(res))
  //     .catch(res => this.httpError(res))  
  // }


}
