import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateQuizService } from '../services/create-quiz.service';
import { LoginServiceService } from '../services/login-service.service';

@Component({
  selector: 'app-studenthome',
  templateUrl: './studenthome.component.html',
  styleUrls: ['./studenthome.component.css']
})
export class StudenthomeComponent implements OnInit {

  constructor( private quizservice : CreateQuizService, private route: Router, private ls  :LoginServiceService ) { }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    this.firstname = sessionStorage.getItem('firstname');
    this.lastname = sessionStorage.getItem('lastname');

    this.getStudentquizes();
    this.getStudenPendingtquizes();
  }

  username;
  firstname;
  lastname;

  allStudentQuizes;

  getStudentquizes(){
    this.quizservice.getStudentQuiz(String(this.firstname+" "+this.lastname)).subscribe(Response=>{
      this.allStudentQuizes = Response;
    })
  }


  allStudentPendingQuizes;

  getStudenPendingtquizes(){
    this.quizservice.getStudentPendingQuiz(String(this.firstname+" "+this.lastname)).subscribe(Response=>{
      this.allStudentPendingQuizes = Response;
    })
  }


  refresh(){
    this.getStudentquizes();
    this.getStudenPendingtquizes();
  }

  storeQuizData(quizname:string, createdby :string, quizDuration:string){
    this.ls.setquizStatus(true);
    sessionStorage.setItem("quizname", quizname);
    sessionStorage.setItem("createdby",createdby);
    sessionStorage.setItem("quizDuration",quizDuration);
    this.updateMarks(quizname,createdby,"0");
    this.route.navigate(['\Q']);
    this.ls.setstudentLoginStatus(false);
    // const url = this.route.serializeUrl(
    //   this.route.createUrlTree([`\Q`])
    // );
    // window.open(url, '_blank');
  }

  updatemarksresponse;
  updateMarks(quizname:string, createdby :string, marks:any){
    this.quizservice.updateMarks(String(this.firstname+" "+this.lastname), marks, createdby,quizname).subscribe(Response=>{
      this.updatemarksresponse = Response;
    })
  }

  signOut(){
    sessionStorage.clear();
    console.log(sessionStorage)
    this.ls.setstudentLoginStatus(false);
    this.route.navigate(['']);
  }


}
