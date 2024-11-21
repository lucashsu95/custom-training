// ui component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

// img
import Logo from '/52-local-logo.jpg'

// react
import { useTheme } from './theme-provider'
import { Link } from 'react-router-dom'

export default function TheNavbar() {
  const { setTheme } = useTheme()

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 shadow-md md:px-6">
      <span className="text-2xl font-bold">
        <Link
          to="/"
          className="flex items-center gap-3 text-foreground/70 transition-colors hover:text-foreground"
        >
          <img src={Logo} alt="" className="h-7 w-7 rounded" />
          自定練習系統
        </Link>
      </span>

      <nav className="ml-auto flex items-center space-x-5 text-sm font-medium">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>淺色 Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>深色 Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>跟隨系統 System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <a href="https://github.com/lucashsu95/custom-training">
          <FaGithub className="h-6 w-6" />
        </a>
      </nav>
    </header>
  )
}
