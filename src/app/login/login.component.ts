import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../services/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private ls: LoginServiceService, private route: Router) { }

  ngOnInit(): void {
  }




  username;
  password;
  token:any = "";
  match:any;
  invalidCredentials= false;
  role;


  Login(){
    this.ls.Logincheck(this.username,this.password).subscribe(
      response=>{
        this.match=response['message'];
        this.token = response['token'];
        this.role = response['role']
        sessionStorage.setItem('token',response['token'])
        sessionStorage.setItem('username', response['username']);
        sessionStorage.setItem('firstname', response['firstname']);
        sessionStorage.setItem('lastname', response['lastname']);
        if(this.token != undefined  ){

          if(this.role == "Student")
          {
            this.route.navigate(['/S'])
            this.ls.setstudentLoginStatus(true);
          }
          else
          {
            this.route.navigate(['/T'])
            this.ls.setteacherLoginStatus(true);
          }
        }
        else{
          this.invalidCredentials = true;
        }
      }
    )
  }





}
