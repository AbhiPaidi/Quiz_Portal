import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { LoginAuthGuard } from './guards/login-auth.guard';
import { QuizGuardGuard } from './guards/quiz-guard.guard';
import { TeacherGuardGuard } from './guards/teacher-guard.guard';
import { LoginComponent } from './login/login.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultsComponent } from './results/results.component';
import { SignupComponent } from './signup/signup.component';
import { StudenthomeComponent } from './studenthome/studenthome.component';
import { TeacherHomePageComponent } from './teacher-home-page/teacher-home-page.component';

const routes: Routes = [
  {path:'',component : LoginComponent},
  {path:'l',component : LoginComponent},
  {path:'signup',component : SignupComponent},
  {path:'forgetpassword',component : ForgetpasswordComponent},
  {path:'S',component : StudenthomeComponent,canActivate :[LoginAuthGuard] },
  {path:'T',component : TeacherHomePageComponent, canActivate :[TeacherGuardGuard]},
  {path:'Q',component : QuizComponent, canActivate:[QuizGuardGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
