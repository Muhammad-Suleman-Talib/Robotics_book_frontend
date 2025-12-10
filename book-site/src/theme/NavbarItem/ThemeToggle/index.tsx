import React from 'react';
import ThemeToggle from '@site/src/components/ThemeToggle';
import type { Props } from '@theme/NavbarItem/DefaultNavbarItem'; // Adjust if DefaultNavbarItem is not the base

export default function NavbarThemeToggle({
  className,
}: Props): JSX.Element {
  return <ThemeToggle className={className} />;
}
