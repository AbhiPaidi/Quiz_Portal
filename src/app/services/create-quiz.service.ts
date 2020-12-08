import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateQuizService {

  constructor(private http: HttpClient) { }

  createQuiz(createdBy:any,quizName:any,quizDuration:any,quizSection:any,quizFile:any){
    console.log(createdBy);
    return this.http.post('http://127.0.0.1:8000/uploadQuiz',{"createdBy" : createdBy,"quizname" :quizName,"quizduration":quizDuration,"quizSection":quizSection,"quizFile": quizFile})
  }

  getQuizes(createdBy:any){
    return this.http.get('http://127.0.0.1:8000/getQuiz',{params:{username : createdBy}})
  }


  deleteQuiz(createdBY:any, quizName:any){
    return this.http.delete('http://127.0.0.1:8000/deleteQuiz',{ params:{createdBy :createdBY, quizname:quizName}})
  };


  getStudentQuiz(username:any){
    return this.http.get('http://127.0.0.1:8000/getStudentQuiz',{params:{studentName : username}})
  }

  getStudentPendingQuiz(username:any){
    return this.http.get('http://127.0.0.1:8000/getStudentPendingQuiz',{params:{studentName : username}})
  }

  updateMarks(username:any, marks:any, createdby:any,quizname:any){
    return this.http.put('http://127.0.0.1:8000/updateMarks',{"createdBy":createdby, "quizname": quizname, "marks":marks,"studentName":username})
  }

  viewResults(quizname:any, createdby:any){
    return this.http.get('http://127.0.0.1:8000/viewResults',{ params:{createdby :createdby, quizname:quizname}})
  }

}
