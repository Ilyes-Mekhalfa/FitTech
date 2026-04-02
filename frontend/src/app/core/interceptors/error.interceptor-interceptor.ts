import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from "rxjs";
import { throwError } from "rxjs";
import { inject } from "@angular/core";
import { Router } from '@angular/router';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)

  return next(req).pipe(
    catchError((error)=>{
      if(error.status === 401){
        router.navigate(['/login'])
      }

      if (error.status === 403) {
        console.error("Access denied");
      }

      if (error.status === 500) {
        console.error("Server error occurred");
      }

      if (error.status === 0) {
        console.error("Network error. API unreachable.");
      }

      return throwError(()=> error)
    })
  )
};
