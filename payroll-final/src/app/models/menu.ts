// src/app/models/menu.model.ts
export interface MenuItem {
  id: number;
  na: string;
  st: string;
  mm: number;
  sm: number;
  so: number;
}

export interface Menu {
  id: number;
  name: string;
  icon?: string; // Optional: To include icons if needed
  subMenus?: SubMenu[];
  isExpanded: boolean;
}

export interface SubMenu {
  id: number;
  name: string;
  link: string; // Router link or external link
}

export interface SettingLink {
  name: string;
  url: string;
  icon: string;
}

export interface Setting {
  links: SettingLink[];
}

