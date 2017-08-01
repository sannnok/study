import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ActivatedRoute } from "@angular/router";
import { UserService } from '../user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  title:string;
  successFlag:boolean;
  string:string;
  alertTrigger:boolean;
  searchS:string;
  product:string;
  method: string;
  numberOfPage: string;
  quantityOfNomenclature:number;
  liveSearch:boolean;
  ngrok:string;
  formMethod:string;
  id:string;
  warning: boolean;
  stringCart: string;
  
  constructor(private http:Http, private route: ActivatedRoute, private user: UserService){
	
	this.title = 'app';
	this.string = '';
	this.successFlag = false;
	this.alertTrigger = false;
	this.searchS = '';
	this.product ='';
	this.method = route.snapshot.params['method'];
	this.numberOfPage = route.snapshot.params['numberOfPage'];
	this.quantityOfNomenclature = 0;
	this.formMethod = route.snapshot.params['formMethod'];
  this.warning = false;
  
  }
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  ngOnInit() {
  	// Здесь можно выполнять загрузку данных с сервера или из других источников данных.
  	this.liveSearch = false;
  	this.ngrok = "8fabfbab";
    console.log(this.user.getUserId())
 }


  HTTPVar;
  HTTPVar1;
  
  httpSuccess(res){
    //this.HTTPVar = JSON.parse(res._body);
    this.HTTPVar = res.json();
    this.string = this.HTTPVar;
    this.successFlag = true;
    console.log('res: ',this.string);
  }

  httpSuccessAddToCart(res){
    this.HTTPVar1 = res.json();
    this.stringCart = this.HTTPVar1;
    if((this.stringCart[1] != undefined) && (this.stringCart[1][0] != undefined) ){
      this.warning = true;
      console.log('ЗАШЛИ')
    }
      this.alertTrigger = true;
      setTimeout(() => {
        this.alertTrigger = false;
      }, 2000);      
    
  }

  httpError(err){
  	console.log("Error");
  	console.log(err);
  }

  HTTPRequest(){
  	this.http
  	  .get("http://"+ this.ngrok+".ngrok.io/getTestAngular")
  	  .toPromise()
  	  .then(res => this.httpSuccess(res))
  	  .catch(res => this.httpError(res))

  }

	//heroes = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];

	Search(searchString: string) {
		if (searchString) {
			this.searchS = searchString;
		  //this.heroes.push(searchString);
		  //console.log (searchString);
	  	this.http
	  	  .get("http://"+ this.ngrok+".ngrok.io/getTestAngular?Param="+searchString)
	  	  .toPromise()
	  	  .then(res => this.httpSuccess(res))
	  	  .catch(res => this.httpError(res))



		}
	}

  body = {}; //{response:"Post: Hello from Angular!"}
	addToCart(hero: any){
      this.product = hero;
      this.warning = false;
      this.body = {result:{
        data:{
          user_id:this.user.getUserId(),
          nom_id:hero.id, 
          sklad_id:hero.sklad_id, 
          count:1, 
          price_type:1, 
          currency:hero.currency
      },action:'addToCart'}};

      this.http
        .post("http://"+ this.ngrok+".ngrok.io/addToCart",this.body)
        .toPromise()
        .then(res => this.httpSuccessAddToCart(res))
        .catch(res => this.httpError(res)) 

      console.log(hero.id,'sklad_id: ',hero.sklad_id, '1','1', hero.currency)
	}

	toggleLiveSearch(){
		if(this.liveSearch == false){
			this.liveSearch = true;
		}else{
			this.liveSearch = false;
		}
	}
}
