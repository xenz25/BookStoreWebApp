import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private basePath = 'https://localhost:44379';
  private token = '';
  private credential = {
    email: 'user@example.com',
    password: 'P@ssword123',
  };

  constructor(private http: HttpClient) {
    console.log('CONSTRUCT:', this.token);
  }

  private signInToApi(): Promise<any> {
    return new Promise((resolve, reject) => {
      // useless must be stored in a file or database because values reset when compoennet is rendered
      // or the server store the token on a cookie and retieves it by the client
      if (this.token == '') { 
        this.http
          .post<{ token: any }>(
            `${this.basePath}/api/accounts/signin`,
            this.credential
          )
          .subscribe({
            next: (data) => {
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
      }
    });
  }

  // get all books method
  public async getBooks(): Promise<Observable<any>> {
    console.log('GET:', this.token);
    // signin if token is not available
    var token = await this.signInToApi();

    console.log('GET:', this.token);


    // make a request
    return this.http.get(`${this.basePath}/api/books`, {
      headers: { Authorization: token },
    });
  }

  // save a book method
  public async saveBook(book: any): Promise<Observable<any>> {
    console.log('SAVE:', this.token);

    var token = await this.signInToApi();

    console.log('SAVE:', this.token);


    // http.post(<base route>, <request body>, <options>)
    return this.http.post(this.basePath, book, {
      headers: { Authorization: token },
    });
  }
}
