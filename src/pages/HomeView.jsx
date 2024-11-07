import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CiSquareQuestion } from 'react-icons/ci'
import { MdNotStarted } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function HomeView() {
  return (
    <section className="p-6">
      <Link to="/training/setting">
        <Alert className="custom-alert">
          <MdNotStarted className="h-4 w-4" />
          <AlertTitle className="text-base font-bold">開始練習</AlertTitle>
          <AlertDescription>練習前請先上傳題庫</AlertDescription>
        </Alert>
      </Link>

      <Link to="/upload">
        <Alert className="custom-alert mt-4">
          <CiSquareQuestion className="h-4 w-4" />
          <AlertTitle className="text-base font-bold">題庫</AlertTitle>
          <AlertDescription>在題庫頁面上傳題庫</AlertDescription>
        </Alert>
      </Link>
    </section>
  )
}
