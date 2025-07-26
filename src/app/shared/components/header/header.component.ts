import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { sortTypes } from '../../../core/utils/utils';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../interface/ICart';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  sortList = sortTypes;
  searchTerm = '';
  renderer = inject(Renderer2);
  id = inject(PLATFORM_ID);
  router = inject(Router);
  route = inject(ActivatedRoute);
  selectedSort = '';

  search() {
    const queryParams = {
      searchText: this.searchTerm,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  sort() {
    const queryParams = {
      sort: this.selectedSort,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
