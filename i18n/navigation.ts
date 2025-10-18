import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// APIs de navegação que consideram o idioma ativo
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
