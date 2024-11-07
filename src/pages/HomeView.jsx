import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BsFillQuestionSquareFill } from 'react-icons/bs'
import { MdNotStarted } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { FaBook } from 'react-icons/fa'
export default function HomeView() {
  return (
    <section className="w-100 grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
      <Link to="/training/setting">
        <Alert className="custom-alert">
          <MdNotStarted className="h-5 w-5" />
          <AlertTitle className="text-base font-bold">開始練習</AlertTitle>
          <AlertDescription>練習前請先上傳題庫</AlertDescription>
        </Alert>
      </Link>

      <Link to="/upload">
        <Alert className="custom-alert">
          <BsFillQuestionSquareFill className="h-5 w-5" />
          <AlertTitle className="text-base font-bold">題庫</AlertTitle>
          <AlertDescription>在題庫頁面上傳題庫</AlertDescription>
        </Alert>
      </Link>

      <a target="_blank" href="https://github.com/lucashsu95/custom-training/blob/main/README.md">
        <Alert className="custom-alert">
          <FaBook className="h-5 w-5" />
          <AlertTitle className="text-base font-bold">教學-說明書</AlertTitle>
          <AlertDescription>查看使用系統說明書</AlertDescription>
        </Alert>
      </a>
    </section>
  )
}
