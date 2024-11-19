import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  currentUserSelector,
  isAnonymousSelector,
  isLoggedInSelector,
} from '../../../../../auth/store/selectors';
import { CurrentUserInterface } from '../../../../types/currentUser.interface';

@Component({
  selector: 'mc-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isAnonymous$: Observable<boolean>;
  currentUser$: Observable<CurrentUserInterface | null>;

  constructor(private store: Store) {}

  public ngOnInit() {
    this.isLoggedIn$ = this.store.pipe(select(isLoggedInSelector) as any);
    this.isAnonymous$ = this.store.pipe(select(isAnonymousSelector) as any);
    this.currentUser$ = this.store.pipe(select(currentUserSelector) as any);
  }
}
