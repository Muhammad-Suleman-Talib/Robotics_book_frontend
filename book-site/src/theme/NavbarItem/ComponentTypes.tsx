import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DocNavbarItem from '@theme/NavbarItem/DocNavbarItem';
import DocSidebarNavbarItem from '@theme/NavbarItem/DocSidebarNavbarItem'; // NEW IMPORT
import DocsVersionNavbarItem from '@theme/NavbarItem/DocsVersionNavbarItem';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
import LocaleDropdownNavbarItem from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import SearchNavbarItem from '@theme/NavbarItem/SearchNavbarItem';
import HtmlNavbarItem from '@theme/NavbarItem/HtmlNavbarItem';
import AuthNavbarItem from './CustomAuthNavbarItem'; // Our custom item

const ComponentTypes = {
  default: DefaultNavbarItem,
  doc: DocNavbarItem,
  docSidebar: DocSidebarNavbarItem, // NEW MAPPING
  docsVersion: DocsVersionNavbarItem,
  docsVersionDropdown: DocsVersionDropdownNavbarItem,
  localeDropdown: LocaleDropdownNavbarItem,
  search: SearchNavbarItem,
  html: HtmlNavbarItem,
  'custom-auth-navbar-item': AuthNavbarItem, // Map our custom type to our component
};

export default ComponentTypes;