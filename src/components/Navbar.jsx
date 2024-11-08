// import {
//   Sheet,
//   SheetTrigger,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
//   SheetContent
// } from '@/components/ui/sheet'
// import { Button } from '@/components/ui/button'
// import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'
import Logo from '/52-local-logo.jpg'
import { useTheme } from './theme-provider'
import { Button } from './ui/button'
import { Sun } from 'lucide-react'
import { Moon } from 'lucide-react'

export default function TheNavbar() {
  const { setTheme } = useTheme()

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 shadow-md md:px-6">
      {/* <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="me-2 lg:hidden">
            <HamburgerMenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>
              <Link to="/" className="text-foreground/60 transition-colors hover:text-foreground">
                自定練習系統
              </Link>
            </SheetTitle>
            <SheetDescription>自己的考題自己新增</SheetDescription>
          </SheetHeader>
          <nav className="grid gap-2 py-6"></nav>
        </SheetContent>
      </Sheet> */}

      <span className="text-2xl font-bold">
        <Link
          to="/"
          className="flex items-center gap-3 text-foreground/70 transition-colors hover:text-foreground"
        >
          <img src={Logo} alt="" className="h-7 w-7" />
          自定練習系統
        </Link>
      </span>

      {/* <nav className="hidden items-center space-x-6 text-sm font-medium lg:flex"></nav> */}
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
            <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <a href="https://github.com/lucashsu95/custom-training">
          <FaGithub className="h-6 w-6" />
        </a>
      </nav>
    </header>
  )
}
