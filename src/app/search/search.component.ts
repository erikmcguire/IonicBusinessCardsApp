import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../app.config';
import { AuthService } from '../auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { ImageService } from '../image.service';
import { Card } from '../card.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
    cards: Observable<any[]>;
    showResults: boolean = false;
    fn: boolean = false;
    org: boolean = false;
    stypes: string[] = ['First Name', 'Organization'];
    t: string = "";
    placeholder = "First Name";
    constructor(private authService: AuthService,
                private imgService: ImageService,
                private afs: AngularFirestore) {
        }

    toggleSearch(t) {
        if (t === 'First Name') {
            this.fn = true;
            this.org = false;
        } else if (t === 'Organization') {
            this.org = true
            this.fn = false;
        }
    }
    changePH(t) {
        this.placeholder = t;
    }
    searchCards(query): boolean {
        if (!query) return false;
        if (this.fn) {
            this.t = "firstNameLower";
        }
        else if (this.org) {
            this.t = "orgLower"
        }
        if (!this.t) {
            this.t = "firstNameLower";
        }
        
       this.cards = this.afs.collection(
                             config.collection_endpoint,
                             ref => ref.where("author", "==",
                                 JSON.parse(this.authService.getUser()).uid)
                                 .where(this.t.trim(), '==', query.trim().toLowerCase()).orderBy('addedAt')).snapshotChanges()
             .pipe(
                map(actions => {
                    return actions.map(a => {
                    const data = a.payload.doc.data() as Card;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
           })
       );
       this.showResults = true;
       return false;
   }

    displayCardImg(card) {
        this.imgService.displayCardImg(card);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.showResults = false;
    }
}
