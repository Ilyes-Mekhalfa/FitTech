import { HttpInterceptorFn } from "@angular/common/http";
import { catchError } from "rxjs";
import { throwError } from "rxjs";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { TokenService } from "../services/token.service";
export const authInterceptor: HttpInterceptorFn=(req, next)  =>{
    const router = inject(Router);
    const tokenService = inject(TokenService)
    const token  = tokenService.getToken()

    let request = req;

    if(token){
        request = req.clone({
            setHeaders: {
                Authorization : `Bearer ${token}`
            }
        })
    }

    return next(request).pipe(
        catchError((error)=>{
            if (error.status === 401) {
                tokenService.deleteToken()
                router.navigate(['/login'])
            }
            return throwError(()=> error)
        })
    )
}
