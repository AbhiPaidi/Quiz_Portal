import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../services/login-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private ls: LoginServiceService, private route: Router) { }

  ngOnInit(): void {
  }

  sHalf = true;
  firstname;
  lastname;
  username;
  password;
  id;
  role:any;
  section:any;
  match:any;


  TsignUp(){

    this.ls.TeacherSignupcheck(this.username,this.password,this.firstname,this.lastname,this.role,this.id).subscribe(
      response=>{
        this.match=response['message'];
        this.route.navigate(['/l'])
      }
    )
 }

 SsignUp(){

  this.ls.StudentSignupcheck(this.username,this.password,this.firstname,this.lastname,this.role,this.id,this.section).subscribe(
    response=>{
      this.match=response['message'];
      this.route.navigate(['/l'])
    }
  )
}


}
