// ui component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { HiOutlineMenuAlt3 } from 'react-icons/hi'
import { Moon, Sun } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

// img
import Logo from '/52-local-logo.jpg'

// react
import { Link } from 'react-router-dom'
import { Switch } from './ui/switch'
import { formatDate } from '@/lib/functions'

// provider
import { useTheme } from '@/provider/ThemeProvider'
import { useSetting } from '@/provider/SettingProvider'

export default function TheNavbar() {
  const { theme, setTheme } = useTheme()
  const { enableTraining, handleSetEnableTraining } = useSetting()

  return (
    <header className="sm:h-18 flex h-14 w-full shrink-0 items-center px-4 shadow-md md:h-20 md:px-6">
      <span className="text-lg font-bold sm:text-xl md:text-2xl">
        <Link
          to="/"
          className="flex items-center gap-3 text-foreground/70 transition-colors hover:text-foreground"
        >
          <img src={Logo} alt="" className="h-7 w-7 rounded" />
          自定練習系統
        </Link>
      </span>

      <nav className="ml-auto flex items-center gap-4 text-sm font-medium">
        <Dialog>
          <DialogTrigger>
            <HiOutlineMenuAlt3 className="h-6 w-6" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">設定</DialogTitle>
              <DialogDescription></DialogDescription>
              <section className="flex items-center justify-between">
                <div>每日答題量限制 2 題</div>
                <div className="flex items-center justify-center gap-2">
                  <Switch
                    checked={enableTraining != 'false'}
                    className="mr-7"
                    onClick={() =>
                      handleSetEnableTraining(
                        enableTraining == 'false' ? formatDate(new Date().getTime()) : 'false'
                      )
                    }
                  />
                </div>
              </section>
              <section className="flex items-center justify-between">
                <div className="my-2">選擇主題</div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    aria-label="Toggle theme"
                  />
                  <Moon className="h-5 w-5" />
                </div>
              </section>
              <DialogFooter>
                <section className="mt-2 flex w-full justify-center">
                  <a href="https://github.com/lucashsu95/custom-training">
                    <FaGithub className="h-6 w-6" />
                  </a>
                </section>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  )
}
