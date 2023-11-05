import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent {
  item: string = '';
  errorMessage = '';
  index!: number; 

  constructor(public activeModal: NgbActiveModal, private http: HttpClient) { }

  save() {
    if (!this.item) {
      this.errorMessage = 'Пожалуйста введите текст в поле';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000); 
      return;
    }
    this.http.put(`http://localhost:5000/api/shopping_list/${this.index}`, { item: this.item })
      .subscribe(response => {
        this.activeModal.close(this.item);
      }, error => {
        this.errorMessage = error.error.error;
      });
  }
}
