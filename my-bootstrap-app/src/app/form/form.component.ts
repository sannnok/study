import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Login } from "../login.model";
import { Routes, RouterModule, Router } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  server:string;
  string:any;
  successFlag:boolean;
	formMethod:string;
	signin:boolean;
  //adminBoolean:boolean;

  constructor(private route: ActivatedRoute, private http:Http, private _router: Router, private user: UserService ) {

  	this.formMethod = route.snapshot.params['formMethod'];
  	this.signin = true;
    this.string ='',
    this.successFlag = false;
    //this.adminBoolean = false;

   }

  ngOnInit() {
  	// Здесь можно выполнять загрузку данных с сервера или из других источников данных.
  	  	//console.log(this.formMethod)
        this.server = "188.237.141.56:2020"
    //this.adminBoolean = false;
    //console.log('adminBoolean',this.adminBoolean)
  }

  toggleFunction(){
  	if(this.signin == true){
  		this.signin = false;
  	}else{
  		this.signin = true;
  		
  	}
  }


  HTTPVar;
  
  httpSuccess(res){
    this.HTTPVar = res.json();
    this.string = this.HTTPVar;

    this.successFlag = true;
    //console.log("Success! ",this.string.login);


    if(this.string.login == true){
      this.user.setUserLoggedIn(this.string.username,this.string.userid);
      this._router.navigate(['products/page/1'])
      localStorage.setItem('currentUser', JSON.stringify({ username: this.string.username, token: this.string.token, userid: this.string.userid}));
      //this.adminBoolean = true;
    }else{
      this.model.email = '';
      this.model.passw = '';
    }
    //console.log('token: ', this.string.token)
  }

  httpError(err){
    console.log("Error");
    console.log(err);
  }

  HTTPRequest(){
    // this.http
    //   .get("http://"+ this.ngrok+".ngrok.io/getTestAngular")
    //   .toPromise()
    //   .then(res => this.httpSuccess(res))
    //   .catch(res => this.httpError(res))

  }

  model = new Login();
  get modelTest(){
    return JSON.stringify(this.model);
  }



  body = {result:{data:this.model,action:'login'}}; //{response:"Post: Hello from Angular!"}

  post(e){
    this.http
      .post("http://"+ this.server+"/echo",this.body)
      .toPromise()
      .then(res => this.httpSuccess(res))
      .catch(res => this.httpError(res))  

      console.log(e)
  }

}
