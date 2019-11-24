import { Component, Input, OnInit } from '@angular/core';
import { Card } from "../card.model";
import { AppService } from '../app.service';
import { config } from '../app.config';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-businesscard',
  templateUrl: './businesscard.component.html',
  styleUrls: ['./businesscard.component.scss']
})
export class BusinesscardComponent implements OnInit {
  @Input() card: Card = new Card();
  myCard: any = {};
  editMode: boolean = false;
  cardToEdit: any = {};
  saved: boolean = true;
  isActive: boolean = false;
  dbhover: boolean = false;
  ebhover: boolean = false;
  cards: Observable<any[]>;
  constructor(private appService: AppService,
              private authService: AuthService,
              private imgService: ImageService,
              private afs: AngularFirestore) { }

  edit(card: Card) {
    this.cardToEdit = card;
    this.editMode = true;
    this.myCard = card;
    this.saved = false;
  }

  displayCardImg(card) {
      return this.imgService.displayCardImg(card);
  }

  cancelEdit() {
      this.editMode = false;
      this.saved = true;
  }
  getValue(field, ph) {
      if (field && field.trim()) {
          return field;
      } else {
       return ph;
    }
  }
  saveCard(firstName: HTMLInputElement,
           lastName: HTMLInputElement,
           organization: HTMLInputElement,
           position: HTMLInputElement,
           email: HTMLInputElement,
           phone: HTMLInputElement,
           address: HTMLInputElement): boolean {
     if (this.myCard !== null) {
        let card = this.myCard;
        if (!this.editMode) {
           this.appService.addCard(card);
        } else {
            let card = {
                    firstName: firstName.value || this.myCard.firstName,
                    lastName: lastName.value || this.myCard.lastName,
                    firstNameLower: firstName.value.toLowerCase() || this.myCard.firstName.toLowerCase(),
                    organization: organization.value || this.myCard.organization,
                    orgLower: organization.value.toLowerCase() || this.myCard.organization.toLowerCase(),
                    position: position.value || this.myCard.position,
                    email: email.value || this.myCard.email,
                    phone: phone.value || this.myCard.phone,
                    address: address.value || this.myCard.address
                        };
           let cardId = this.cardToEdit.id;
           this.appService.updateCard(cardId, card);
        }
        this.editMode = false;
        this.saved = true;
        this.myCard  = "";
     }
     return false;
  }

  deleteCard(card: Card) {
     let cardId = card.id;
     this.appService.deleteCard(cardId);
  }

  ngOnInit() {
      this.cards = this.afs
        .collection(config.collection_endpoint, ref => ref.where("author", "==", JSON.parse(this.authService.getUser()).uid).orderBy('addedAt'))
        .snapshotChanges()
        .pipe(
               map(actions => {
                   return actions.map(a => {
                   const data = a.payload.doc.data() as Card;
                   const id = a.payload.doc.id;
                   return { id, ...data };
               });
          })
      );
  }


}
