import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function HomeView() {
  return (
    <section className="p-6">
      <article className="space-y-5">
        <Alert>
          <AlertTitle>開始練習</AlertTitle>
          <AlertDescription>練習前請先上傳題庫</AlertDescription>
        </Alert>
        <Alert>
          <AlertTitle>題庫</AlertTitle>
          <AlertDescription>在題庫頁面上傳題庫</AlertDescription>
        </Alert>
      </article>
    </section>
  )
}
