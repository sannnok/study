import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Router } from "@angular/router";

@Injectable()
export class UserService {

  private isUserLoggedIn;
  public username;
  private userid;
  public token;

  server :string = "188.237.141.56:2020" //"9aeffdac.ngrok.io"

  constructor(private http:Http, private _router: Router) { 
    if (localStorage.getItem('currentUser')){
      this.isUserLoggedIn = true;
    }else{
      this.isUserLoggedIn = false;      
    }
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;  
    this.username = currentUser && currentUser.username;
    this.userid = currentUser && currentUser.userid;  
    // console.log('constructor US ', ' username ',this.username, ' userid ', this.userid)
    // console.log('token US  ', this.token)
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
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userid = currentUser && currentUser.userid;      
  	return this.userid;
  }

  tokenNotExpired(){
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;      
    let headers = new Headers();
    headers.append('token', this.token) 
    this.http
        .post("http://"+ this.server+"/secure-api/secure", {}, {headers:headers})
        .toPromise()
        .then(res => {
          if(res.json().verification == true){
            //console.log("verification == true"); 
            this.isUserLoggedIn = true;
            return true;
          }else{
            this.isUserLoggedIn = false;
            console.log("Verification == false. Unsigned. ", res.json().speech);
            localStorage.removeItem('currentUser');
            return false;
          } 
        })
        .catch(res => {
          //console.log('работает!!!!!! ERROR'); 
          console.log("Error in US token expired: ", res.json());
          this.isUserLoggedIn = false;
          this._router.navigate(['/']);
          return false;
        }) 
        //return true;
  }

  // httpSuccess(res){
  //   if(res.json().verification == true){
  //     console.log("verification == true"); 
  //     this.isUserLoggedIn = true;
  //   }else{
  //     this.isUserLoggedIn = false;
  //     console.log("Verification == false: ", res.json().speech)
  //     localStorage.removeItem('currentUser');
  //   } 
  // }

  // httpError(res){
  //   console.log("Error in US token expired: ", res.json())
  // }
}
