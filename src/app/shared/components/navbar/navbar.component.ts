import { Component, inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { navLinks } from '../../../core/utils/utils';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  navLinks = navLinks;
  cartService = inject(CartService);
  cartCount = 0;
  renderer = inject(Renderer2);
  id = inject(PLATFORM_ID);

  ngOnInit() {
    this.themeMode();
    this.cartService.cartCountSubject.subscribe((count) => {
      this.cartCount = count;
    });
  }

  themeMode(): void {
    if (isPlatformBrowser(this.id)) {
      const html = document.querySelector('html');
      if (html) {
        const isLightOrAuto = localStorage.getItem('hs_theme') === 'light';
        const isDarkOrAuto = localStorage.getItem('hs_theme') === 'dark';

        if (isLightOrAuto && html.classList.contains('dark')) {
          this.renderer.removeClass(html, 'dark');
        } else if (isDarkOrAuto && html.classList.contains('light')) {
          this.renderer.removeClass(html, 'light');
        } else if (isDarkOrAuto && !html.classList.contains('dark')) {
          this.renderer.addClass(html, 'dark');
        } else if (isLightOrAuto && !html.classList.contains('light')) {
          this.renderer.addClass(html, 'light');
        }
      }
    }
  }
}
