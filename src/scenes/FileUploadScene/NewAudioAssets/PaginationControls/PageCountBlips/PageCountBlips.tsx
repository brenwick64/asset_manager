import './PageCountBlips.css'

type Props = {
  currentPage: number
  totalPages: number
}

function PageCountBlips({ currentPage, totalPages }: Props) {
  return (
    <div className="page-count-blips">
      {Array.from({ length: totalPages }, (_, i) => {
        const page: number = i + 1
        const isActive: boolean = page === currentPage

        return (
          <div key={page} className={`blip${isActive ? " blip-active" : ""}`} />
        )
      })}
    </div>
  )
}


export default PageCountBlips