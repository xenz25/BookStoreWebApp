import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BookService } from '../book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  // create a form group instance this will hold the data
  public bookForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private service: BookService) {}

  ngOnInit(): void {
    this.init();
  }

  // create a method to call in the HTML file to save the form data
  public saveBook(): void {
    this.service.saveBook(this.bookForm.value).then((observer) => {
      observer.subscribe((result) => {
        // returns the id of the created book
        alert(`New book added with an id = ${result.id}`);
        window.location.href = '/books';
      });
    });
  }

  // initilization of ReactiveForm method
  private init(): void {
    this.bookForm = this.formBuilder.group({
      title: [],
      description: [],
    });
  }
}
