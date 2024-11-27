import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem, Menu, SubMenu, Setting } from 'src/app/models/menu';

declare var $: any; // Declare jQuery globally


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  menuData: MenuItem[] = [
    { "id": 1, "na": "SETUP", "st": "A", "mm": 1, "sm": 0, "so": 1 },
    { "id": 2, "na": "TRANSACTION MASTER", "st": "A", "mm": 2, "sm": 0, "so": 2 },
    { "id": 3, "na": "PROCESS", "st": "A", "mm": 3, "sm": 0, "so": 3 },
    { "id": 4, "na": "REPORTS", "st": "A", "mm": 4, "sm": 0, "so": 4 },
    { "id": 5, "na": "Org Attributes Headers", "st": "A", "mm": 1, "sm": 1, "so": 1 },
    { "id": 6, "na": "Org Attributes Details", "st": "A", "mm": 1, "sm": 2, "so": 2 },
    { "id": 7, "na": "Salary Group", "st": "A", "mm": 1, "sm": 3, "so": 3 },
    { "id": 8, "na": "Leave Group", "st": "A", "mm": 1, "sm": 4, "so": 4 },
    { "id": 9, "na": "Wage Period", "st": "A", "mm": 1, "sm": 5, "so": 5 },
    { "id": 10, "na": "MAIN 2 SCREEN 1", "st": "A", "mm": 2, "sm": 1, "so": 1 },
    { "id": 11, "na": "MAIN 3 SCREEN 12", "st": "A", "mm": 3, "sm": 1, "so": 1 },
    { "id": 12, "na": "MAIN 4 SCREEN 1", "st": "A", "mm": 4, "sm": 1, "so": 1 }
  ];

  menus: Menu[] = [];

  ngOnInit(): void {
    this.buildMenu();
  }

  ngAfterViewInit(): void {
    // Initialize MetisMenu after the view has been initialized
    $('#sidebar-menu').metisMenu();
    $('#customize-menu').metisMenu();
  }

  // ngAfterViewInit(): void {
  //   const sidebarMenu = $('#sidebar-menu');
  //   if (!sidebarMenu.hasClass('metisMenu')) {
  //     sidebarMenu.metisMenu({
  //       toggle: true,
  //     });
  //   }
  // }
  
  buildMenu(): void {
    // Filter main menus (sm: 0) and sort them by 'so'
    const mainMenus = this.menuData.filter((item) => item.sm === 0).sort((a, b) => a.so - b.so);

    this.menus = mainMenus.map((main) => {
      const subMenus = this.menuData
        .filter((item) => item.mm === main.mm && item.sm > 0)
        .sort((a, b) => a.so - b.so)
        .map((sub) => ({
          id: sub.id,
          name: sub.na,
          link: this.generateLink(sub.na),
        }));

      return {
        id: main.id,
        name: main.na,
        icon: this.getMenuIcon(main.na),
        isExpanded: false,
        subMenus: subMenus.length > 0 ? subMenus : undefined,
      };
    });
  }

  toggleSubMenu(menu: Menu): void {
    // Toggle current menu
    menu.isExpanded = !menu.isExpanded;

    // Collapse all other menus if required
    this.menus.forEach((m) => {
      if (m !== menu) {
        m.isExpanded = false;
      }
    });
  }

// toggleSubMenu(menu: Menu): void {
//   menu.isExpanded = !menu.isExpanded;
// }


  // Utility function to generate router links based on menu names
  generateLink(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  // Utility function to assign icons based on menu names (customize as needed)
  getMenuIcon(name: string): string {
    switch (name.toUpperCase()) {
      case 'SETUP':
        return 'fa fa-cogs';
      case 'TRANSACTION MASTER':
        return 'fa fa-database';
      case 'PROCESS':
        return 'fa fa-tasks';
      case 'REPORTS':
        return 'fa fa-bar-chart';
      default:
        return 'fa fa-circle';
    }
  }



  settings: Setting[] = [
    {
      links: [
        { name: 'Settings Link 1', url: '#', icon: 'fa fa-pencil-square-o' },
        { name: 'Settings Link 2', url: '#', icon: 'fa fa-pencil-square-o' },
        { name: 'Settings Link 3', url: '#', icon: 'fa fa-pencil-square-o' }
      ]
    }
  ];
}

