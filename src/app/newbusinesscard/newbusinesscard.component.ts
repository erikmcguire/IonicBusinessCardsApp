import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { ImageService } from '../image.service';
import { AuthService } from '../auth.service';
import { Card } from '../card.model';

@Component({
  selector: 'app-newbusinesscard',
  templateUrl: './newbusinesscard.component.html',
  styleUrls: ['./newbusinesscard.component.scss']
})
export class NewbusinesscardComponent implements OnInit {
    card: any;
    constructor(private appService: AppService,
                private imgService: ImageService,
                private authService: AuthService) {
    }

    addCard(firstName: HTMLInputElement, lastName: HTMLInputElement,
            organization: HTMLInputElement, position: HTMLInputElement,
            email: HTMLInputElement,
            phone: HTMLInputElement,
            address: HTMLInputElement): boolean {
      let businessCard = {
                          firstName: firstName.value.trim(),
                          firstNameLower: firstName.value.toLowerCase().trim(),
                          lastName: lastName.value.trim(),
                          organization: organization.value.trim(),
                          orgLower: organization.value.toLowerCase().trim(),
                          position: position.value.trim(),
                          email: email.value.trim(),
                          phone: phone.value.trim(),
                          address: address.value.trim(),
                          author: this.authService.afAuth.auth.currentUser.uid,
                          addedAt: Date.now(),
                          imageUri: this.imgService.filledCard.imageUri || ""
                      };
      this.card = businessCard;
      this.appService.addCard(businessCard);
      return false;
      }

    clearForm() {
        this.imgService.filledCard = new Card();
        this.imgService.base64 = null;
        return "";
      }

    ngOnInit() {

    }


}
