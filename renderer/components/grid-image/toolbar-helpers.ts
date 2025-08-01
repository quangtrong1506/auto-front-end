/**
 * @description Tải file từ url bất kỳ (hỗ trợ cả cross-origin, API...)
 */
export async function downloadFile(url: string, filename?: string): Promise<void> {
   const res = await fetch(url)
   const blob = await res.blob()

   if (!filename) {
      const pathname = new URL(url, window.location.href).pathname
      filename = pathname.split('/').pop() || 'download'
   }

   const blobUrl = URL.createObjectURL(blob)
   const link = document.createElement('a')
   link.href = blobUrl
   link.download = filename
   link.style.display = 'none'
   document.body.appendChild(link)
   link.click()
   document.body.removeChild(link)
   URL.revokeObjectURL(blobUrl)
}
