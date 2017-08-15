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

  server:string;
  string:string;
  successFlag:boolean;

  constructor(private http:Http, private user: UserService) { 
    this.string ='',
    this.successFlag = false
  }
 
  ngOnInit() {
    this.server = "188.237.141.56:2020";
  	// Здесь можно выполнять загрузку данных с сервера или из других источников данных.
    this.getToCartFromServer();
  }

  HTTPVar;
  HTTPVar1;
  
  httpSuccess(res){
    this.HTTPVar = res.json();
    this.string = this.HTTPVar;
    this.successFlag = true;
  }
    httpSuccessDeleteToCart(res){
    this.HTTPVar1 = res.json();
   // this.string = this.HTTPVar1;
    //console.log('string   :   ', this.HTTPVar1)
    this.getToCartFromServer();
  }

  httpError(err){
    console.log("Error");
    console.log(err);
  }

  getToCartFromServer(){
    this.http
      .get("http://"+ this.server+"/getToCart?user_id="+this.user.getUserId()+"&price_type=1")
      .toPromise()
      .then(res => this.httpSuccess(res))
      .catch(res => this.httpError(res))
  }

  body = {}; //{response:"Post: Hello from Angular!"}
  deleteFromCart(item:any){
      this.body = {result:{
        data:{
          user_id : this.user.getUserId(),
          nom_id : item.nom_id, 
          sklad_id : item.sklad_id, 
        },
        action:'addToCart'
      }};
       //console.log('1 ',item.nom_id, ' ', item.sklad_id)
      this.http
        .post("http://"+ this.server+"/deleteFromCart",this.body)
        .toPromise()
        .then(res => this.httpSuccessDeleteToCart(res))
        .catch(res => this.httpError(res)) 
  }

}
