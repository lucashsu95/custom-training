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
import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'
import Logo from '/52-local-logo.jpg'

export default function TheNavbar() {
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
        <a href="https://github.com/lucashsu95/custom-training">
          <FaGithub className="h-6 w-6" />
        </a>
      </nav>
    </header>
  )
}
