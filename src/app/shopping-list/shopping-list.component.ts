import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditItemComponent } from './edit-item/edit-item.component';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  shoppingList: string[] = [];

  constructor(private socket: Socket, private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.updateShoppingList(); // Запроси список покупок при загрузке компонента
    this.socket.fromEvent<string[]>('update_shopping_list').subscribe(data => {
      this.shoppingList = data;
    });
  }

  confirmDelete(index: number) {
    if (confirm('Вы действительно хотите удалить этот элемент?')) {
      this.deleteItem(index);
    }
  }

deleteItem(index: number) {
  this.http.delete(`http://localhost:5000/api/shopping_list/${index}`).subscribe(response => {
    this.socket.emit('update_shopping_list');
  });
}


openEditModal(index: number) {
  const modalRef = this.modalService.open(EditItemComponent);
  modalRef.componentInstance.item = this.shoppingList[index];
  modalRef.componentInstance.index = index;
  modalRef.result.then((editedItem) => {
    if (editedItem) {
      this.shoppingList[index] = editedItem;
    }
  });
}


  updateShoppingList() {
    this.http.get<string[]>('http://localhost:5000/api/shopping_list').subscribe(data => {
      this.shoppingList = data;
    });
  }
}
