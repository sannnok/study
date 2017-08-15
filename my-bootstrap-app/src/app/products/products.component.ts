import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ActivatedRoute } from "@angular/router";
import { UserService } from '../user.service';
import { Routes, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  title:string;
  successFlag:boolean;
  responseJSON:string;
  alertTrigger:boolean;
  searchS:string;
  product:string;
  method: string;
  numberOfPage: string;
  quantityOfNomenclature:number;
  liveSearch:boolean;
  server:string;
  formMethod:string;
  id:string;
  warning: boolean;
  responseCartJSON: string;
  vremArray: number[] = [];
  curPage:number;
  image_url:string;
  
  constructor(private http:Http, private route: ActivatedRoute, private user: UserService, private _router: Router){
	
	this.title = 'app';
	this.responseJSON = '';
	this.successFlag = false;
	this.alertTrigger = false;
	this.searchS = '';
	this.product ='';
	this.method = route.snapshot.params['method'];
	this.numberOfPage = route.snapshot.params['numberOfPage'];
	this.quantityOfNomenclature = 0;
	this.formMethod = route.snapshot.params['formMethod'];
  this.warning = false;
  route.params.subscribe(params => this.initAfterRouteChange(params));
  
  }
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  ngOnInit() {
  	// Здесь можно выполнять загрузку данных с сервера или из других источников данных.
  	this.liveSearch = false;
  	this.server = "188.237.141.56:2020";
  }

  initAfterRouteChange(params:any){
    this.curPage = Number(params.numberOfPage);
    //console.log("init numberOfPage ", params.numberOfPage, this.curPage)

  }  

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

  HTTPVar;
  HTTPVar1;
  l:number;
  i;

  httpSuccess(res){
    //this.HTTPVar = JSON.parse(res._body);
    this.HTTPVar = res.json();
    this.responseJSON = this.HTTPVar.result;
    this.successFlag = true;
    //console.log('res: ',this.responseJSON);

    for (this.i =0; this.i < this.responseJSON.length; this.i++){
      this.vremArray.push(1);
    }
    if(this.HTTPVar.totalRows>20){
      this.l = this.HTTPVar.totalRows/20;
      if(String(this.l).indexOf('.')){
        this.l = Math.ceil(this.l);//Number(String(this.l).substring(0,String(this.l).indexOf('.'))) +1;
      }
    }else{
      this.l = 1;
    }
    //console.log('Q of rows: ', this.l)
  }

  httpSuccessAddToCart(res){
    this.HTTPVar1 = res.json();
    this.responseCartJSON = this.HTTPVar1;
    if((this.responseCartJSON[1] != undefined) && (this.responseCartJSON[1][0] != undefined) ){
      this.warning = true;
      //console.log('ЗАШЛИ')
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
  	  .get("http://"+ this.server+"/getTestAngular")
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
	  	  .get("http://"+ this.server+"/getTestAngular?Param="+searchString+"&NumOfPage="+this.numberOfPage)
	  	  .toPromise()
	  	  .then(res => this.httpSuccess(res))
	  	  .catch(res => this.httpError(res))
		}
	}

  body = {}; //{response:"Post: Hello from Angular!"}
	addToCart(element: any, kol:number){
      this.product = element;
      this.warning = false;
      this.body = {result : {
        data : {
          user_id    : this.user.getUserId(),
          nom_id     : element.id, 
          sklad_id   : element.sklad_id, 
          count      : kol, 
          price_type : 1, 
          currency   : element.currency
      },action : 'addToCart'}};

      this.http
        .post("http://"+ this.server+"/addToCart",this.body)
        .toPromise()
        .then(res => this.httpSuccessAddToCart(res))
        .catch(res => this.httpError(res)) 
     // console.log(element.id,'sklad_id: ',element.sklad_id, '1','1', element.currency)
	}

	toggleLiveSearch(){
		if(this.liveSearch == false){
			this.liveSearch = true;
		}else{
			this.liveSearch = false;
		}
	}



  minusOne(i:number, ost:number){
    //console.log('ost m: ', ost)
    if(this.vremArray[i] > 1){
      this.vremArray[i] = this.vremArray[i] - 1;
    }
  }

  plusOne(i:number, ost:number){
    //console.log('ost p: ', ost)
    if(this.vremArray[i] < ost){
      this.vremArray[i] = this.vremArray[i] + 1;
    }
  }

  postPage(i:number){
    //this._router.navigate(['products/page/'+i])
    //console.log('searchS ' ,this.searchS)
      this.http
        .get("http://"+ this.server+"/getTestAngular?Param="+this.searchS+"&NumOfPage="+i)
        .toPromise()
        .then(res => this.httpSuccess(res))
        .catch(res => this.httpError(res))  
  }
}
