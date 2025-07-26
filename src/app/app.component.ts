import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Router, Event, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { IStaticMethods } from 'preline/dist';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'summit-task';
  ID = inject(PLATFORM_ID);

  constructor(
    private flowbiteService: FlowbiteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && isPlatformBrowser(this.ID)) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    });
  }
}
