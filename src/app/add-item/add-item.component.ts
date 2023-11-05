import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  newItem: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private socket: Socket) { }

  addItem() {
    if (!this.newItem) {
      this.errorMessage = 'Пожалуйста введите текст в поле';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000); 
      return;
    }

    this.http.post('http://localhost:5000/api/shopping_list', { item: this.newItem })
      .subscribe(response => {
        this.newItem = ''; 
        this.socket.emit('update_shopping_list');
        this.errorMessage = ''; 
      }, error => {
        this.errorMessage = error.error.error;
      });
  }
}
