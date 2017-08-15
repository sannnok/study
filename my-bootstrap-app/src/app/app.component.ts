import { Component } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { UserService } from './user.service';
import { Router } from "@angular/router";
import { ViewChild, ElementRef, AfterViewInit} from '@angular/core';
//declare var $:JQueryStatic;

//import {SharedService} from '../shared.service';
//import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private _router: Router, private http:Http, public user: UserService){

  }

  @ViewChild('selectElem') el:ElementRef;
 
  //selectedValue; 
  ngOnInit() {

    this.user.tokenNotExpired();
    this.user.getUserLoggedIn();
   // $(this.el.nativeElement)
   //  //.chosen()
   //  .on('change', (e, args) => {
   //      this.selectedValue = args.selected;
   //  });

  // $('.nav li').on('click', function(){
  //     //$('.btn-navbar').click(); //bootstrap 2.x
  //     $('.navbar-toggle').click() //bootstrap 3.x by Richard
  // });

    //Скрипт, управляющий шторкой
    //1.Функция запускается поссле прогрузки страницы
    $(function(){
      //2.Прячем штоку сразу, иначе лаг, который прячет не в мобильной версии
      $("#myNavbar").hide();
      $("li.hid").click(function(){
        //3.Прячем шторку при нажатии на элементы списков с классом "hid"
        $("#myNavbar").hide(250);
      })
      $("#button").click(function(){
        //4.При нажатии на кнопку с id=button переключаем шторку
        $("#myNavbar").toggle(500);
      })
    })
  }

  logOut(){
     // clear token remove user from local storage to log user out
    this.user.token = null;
    localStorage.removeItem('currentUser');
    this._router.navigate(['/'])
    this.user.tokenNotExpired();
  }

   autoCloseForDropdownCars(event) {
    //console.log('target ', event )
    if (event.target.closest(".nav")) { 
      // do whatever you want here
      //target.hidden = true;
      console.log("do whatever you want here")
      // $('#myNavbar').hide();
      //$("#myNavbar").hide();
    }else{
      //$("#myNavbar").hide();
      var container = $("nav");
      if (!container.is(event.target) // if the target of the click isn't the container...
          && container.has(event.target).length === 0) // ... nor a descendant of the container
      {
          //container.css("display","none");
          $("#myNavbar").hide(250);
          //console.log("кнопка вне контейнера")
      }
    }
   }
}

