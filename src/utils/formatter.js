export const formatCurrencyIDR = (number) => {
  if (isNaN(number)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

export const formatDate = (isoString) => {
  const date = new Date(isoString)

  const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
  const wibDate = new Date(utc + (7 * 60 * 60 * 1000))

  const pad = (n) => n.toString().padStart(2, '0')

  const day = pad(wibDate.getDate())
  const month = pad(wibDate.getMonth() + 1)
  const year = wibDate.getFullYear()

  const hours = pad(wibDate.getHours())
  const minutes = pad(wibDate.getMinutes())

  return `${day}/${month}/${year} ${hours}:${minutes}`
}
