import {Component, HostBinding, HostBindingDecorator, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NavService} from '../../_services/nav.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NavItem} from '@next-solutions/next-solutions-base';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent implements OnInit {
  @HostBinding('attr.aria-expanded') ariaExpanded: boolean | undefined;
  @Input() item: NavItem | undefined;
  @Input() depth: number | undefined;

  constructor(public navService: NavService,
              public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item)
        if (this.item.route && url) {
          // console.log(`Checking '/${this.item.route}' against '${url}'`);
          this.item.expanded = url.indexOf(`/${this.item.route}`) === 0;
          this.ariaExpanded = this.item.expanded;
          // console.log(`${this.item.route} is expanded: ${this.expanded}`);
        }
    });
  }

  onItemSelected(item: NavItem | undefined) {
    if (item) {
      if (!item.children || !item.children.length) {
        this.navService.title = item.displayName;
        this.router.navigate([item.route]);
        // this.navService.closeNav();
      }
      if (this.item)
        if (item.children && item.children.length) {
          this.item.expanded = !this.item.expanded;
        }
    }

  }

  onCreateNgClass() {
    if (this.item) return {active: this.item.route ? this.router.isActive(this.item.route, true) : false, expanded: this.item.expanded}
    return false
  }
}
