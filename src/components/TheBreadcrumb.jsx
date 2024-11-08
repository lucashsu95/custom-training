import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function TheBreadcrumb({ children }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to="/">首頁</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
TheBreadcrumb.propTypes = {
  children: PropTypes.node.isRequired
}
