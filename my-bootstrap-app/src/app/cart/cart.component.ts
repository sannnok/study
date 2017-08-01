import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { UserService } from '../user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  ngrok:string;
  string:string;
  successFlag:boolean;

  constructor(private http:Http, private user: UserService) { 
    this.string ='',
    this.successFlag = false
  }
  cart = [1,123,1234,12];
  push(array){
  	
  	console.log(array[0],' ',array[1]);
  }
  ngOnInit() {
    this.ngrok = "8fabfbab";
  	// Здесь можно выполнять загрузку данных с сервера или из других источников данных.
    this.getToCartFromServer();
  }











  HTTPVar;
  
  httpSuccess(res){
    this.HTTPVar = res.json();
    this.string = this.HTTPVar;
    console.log('string   :   ', this.string)
    this.successFlag = true;
  }

  httpError(err){
    console.log("Error");
    console.log(err);
  }

  getToCartFromServer(){
    console.log('',this.user.getUserId())
    this.http
      .get("http://"+ this.ngrok+".ngrok.io/getToCart?user_id="+this.user.getUserId()+"&price_type=1")
      .toPromise()
      .then(res => this.httpSuccess(res))
      .catch(res => this.httpError(res))
  }

  deleteFromCart(item:any){
    console.log("Удаление...");
  }

}
