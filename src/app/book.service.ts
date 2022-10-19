import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})

export class BookService {
  private basePath = 'https://localhost:44379';
  private token = '';
  private tokenKey = '4p8AvGFWh2HX5m1v';
  private credential = {
    email: 'user@example.com',
    password: 'P@ssword123',
  };

  constructor(private http: HttpClient, private cookieService : CookieService) {
  }

  private hasAvailableToken () : boolean {
    return this.cookieService.check(this.tokenKey);
  }

  private signInToApi(): Promise<any> {
    return new Promise((resolve, reject) => {
      // useless must be stored in a file or database because values reset when compoennet is rendered
      // or the server store the token on a cookie and retieves it by the client
      if (!this.hasAvailableToken()) { 
        // if not available request for a new token
        this.http
          .post<{ key: any, token : any }>(
            `${this.basePath}/api/accounts/SignInCookie`,
            this.credential
          )
          .subscribe({
            next: (data) => {
              // store the token on cookie
              this.cookieService.set(this.tokenKey, data.token);
              this.token = `Bearer ${data.token}`;
            },
            error: (error) => {
              return reject(error);
            },
            complete: () => {
              console.log(this.token);
              return resolve(this.token);
            },
          });
      } else {
        // if availble retrieve the token on cookie
        this.token = `Bearer ${this.cookieService.get(this.tokenKey)}`;
        return resolve(this.token);
      }
    });
  }

  // get all books method
  public async getBooks(): Promise<Observable<any>> {
    // signin if token is not available
    var token = await this.signInToApi();

    // make a request
    return this.http.get(`${this.basePath}/api/books`, {
      headers: { Authorization: token },
    });
  }

  // save a book method
  public async saveBook(book: any): Promise<Observable<any>> {
    var token = await this.signInToApi();

    // http.post(<base route>, <request body>, <options>)
    return this.http.post(`${this.basePath}/api/books`, book, {
      headers: { Authorization: token },
    });
  }
}
