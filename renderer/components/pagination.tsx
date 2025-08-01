'use client'

import { GrNext, GrPrevious } from 'react-icons/gr'

interface PaginationInterface {
   totalPage: number
   currentPage: number
   onChangePage: (page: number) => void
}

function getPaginationRange(totalPage: number, currentPage: number): (number | '...')[] {
   const delta = 1
   const range: (number | '...')[] = []
   const left = currentPage - delta
   const right = currentPage + delta

   let l: number | null = null
   for (let i = 1; i <= totalPage; i++) {
      if (i === 1 || i === totalPage || (i >= left && i <= right)) {
         if (l && i - l > 1) range.push('...')
         range.push(i)
         l = i
      }
   }
   return range
}

export function Pagination({ totalPage, currentPage, onChangePage }: PaginationInterface) {
   function handleChangePage(page: number) {
      if (page === currentPage || page < 1 || page > totalPage) return
      onChangePage(page)
   }

   const pages = getPaginationRange(totalPage, currentPage)

   return (
      <div className="flex items-center justify-center gap-2 py-4">
         <button
            className="flex size-9 cursor-pointer items-center justify-center rounded border border-cyan-500 text-cyan-500 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handleChangePage(currentPage - 1)}
         >
            <GrPrevious size={20} />
         </button>

         {pages.map((page, index) =>
            page === '...' ? (
               <div key={index} className="flex size-9 items-center justify-center">
                  ...
               </div>
            ) : (
               <button
                  key={page}
                  className={`flexjustify-center size-9 items-center rounded border ${
                     page === currentPage
                        ? 'bg-cyan-500 text-white hover:bg-cyan-500'
                        : 'border-cyan-500 text-cyan-500 hover:bg-cyan-100 hover:text-cyan-700'
                  }`}
                  onClick={() => handleChangePage(page)}
               >
                  {page}
               </button>
            ),
         )}

         <button
            className="flex size-9 cursor-pointer items-center justify-center rounded border border-cyan-500 text-cyan-500 disabled:opacity-50"
            disabled={currentPage === totalPage}
            onClick={() => handleChangePage(currentPage + 1)}
         >
            <GrNext />
         </button>
      </div>
   )
}
