import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-info-tabs',
  imports: [CommonModule],
  templateUrl: './event-info-tabs.component.html',
  styleUrl: './event-info-tabs.component.scss'
})
export class EventInfoTabsComponent {
  activeTab: string = 'evento';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
