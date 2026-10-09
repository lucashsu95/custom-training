import { Link, useLocation } from 'react-router-dom'
import { Moon, Settings, Sun } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useTheme } from '@/provider/ThemeProvider'
import { useSetting } from '@/provider/SettingProvider'
import { formatDate } from '@/lib/functions'
import { cn } from '@/lib/utils'
import PropTypes from 'prop-types'

import Logo from '/52-local-logo.jpg'

const NAV_ITEMS = [
  { to: '/', label: '今日' },
  { to: '/upload', label: '題庫' },
  { to: '/history', label: '紀錄' }
]

function NavLink({ to, label }) {
  const { pathname } = useLocation()
  const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'text-sm font-medium transition-colors hover:text-foreground',
        isActive ? 'text-foreground' : 'text-muted-foreground'
      )}
    >
      {label}
    </Link>
  )
}
NavLink.propTypes = { to: PropTypes.string.isRequired, label: PropTypes.string.isRequired }

export default function AppShell({ children, footer }) {
  const { resolvedTheme, setTheme } = useTheme()
  const { enableTraining, handleSetEnableTraining } = useSetting()

  return (
    <>
      {/* Skip link */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-raised"
      >
        跳到主要內容
      </a>

      {/* Sticky header */}
      <header className="sticky top-0 z-header flex h-header w-full shrink-0 items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
        {/* Logo + 名稱（字串沿用 Navbar） */}
        <Link
          to="/"
          className="flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
        >
          <img src={Logo} alt="自定練習系統圖示" className="h-7 w-7 rounded" />
          <span className="text-base font-semibold sm:text-lg">自定練習系統</span>
        </Link>

        {/* Nav links（桌面） */}
        <nav className="ml-6 hidden items-center gap-4 sm:flex" aria-label="主導覽">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
        </nav>

        {/* 右側工具列 */}
        <div className="ml-auto flex items-center gap-2">
          {/* 直接練習 CTA */}
          <Button variant="default" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/training/auto">直接練習</Link>
          </Button>

          {/* 主題切換（邏輯沿用 Navbar：以 resolvedTheme 判斷） */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
            aria-label={resolvedTheme === 'light' ? '切換為深色模式' : '切換為淺色模式'}
          >
            {resolvedTheme === 'light' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* 設定（Dialog 內容沿用 Navbar） */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="設定">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">設定</DialogTitle>
                <DialogDescription>管理練習設定與應用程式選項</DialogDescription>
              </DialogHeader>
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
                    checked={resolvedTheme === 'dark'}
                    onCheckedChange={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
                    aria-label="切換主題"
                  />
                  <Moon className="h-5 w-5" />
                </div>
              </section>
              <DialogFooter>
                <section className="mt-2 flex w-full justify-center">
                  <a
                    href="https://github.com/lucashsu95/custom-training"
                    aria-label="在 GitHub 上查看原始碼"
                  >
                    <FaGithub className="h-6 w-6" />
                  </a>
                </section>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Nav links（行動端，header 下方） */}
      <nav className="flex items-center gap-4 border-b px-4 py-2 sm:hidden" aria-label="主導覽">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} {...item} />
        ))}
        <Link to="/training/auto" className="ml-auto text-sm font-medium text-primary">
          直接練習
        </Link>
      </nav>

      {/* 主內容區 */}
      <main id="content" className="mx-auto w-full max-w-app px-4 py-6 md:px-6">
        {children}
      </main>

      {/* Footer slot */}
      {footer ? <footer className="border-t">{footer}</footer> : null}
    </>
  )
}
AppShell.propTypes = {
  children: PropTypes.node.isRequired,
  footer: PropTypes.node
}
