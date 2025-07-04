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

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const formatToBackendHours = (frontendHours) => {
  if (!frontendHours) return {}

  const backendHours = {}
  DAYS.forEach(day => {
    const dayData = frontendHours[day]
    if (dayData && dayData.isOpen && dayData.open && dayData.close) {
      backendHours[day] = `${dayData.open}-${dayData.close}`
    } else {
      backendHours[day] = null
    }
  })
  return backendHours
}

export const formatToFrontendHours = (backendHours = {}) => {
  const frontendHours = {};
  DAYS.forEach(day => {
    const hours = backendHours[day];
    if (hours && typeof hours === 'string' && hours.includes('-')) {
      const [open, close] = hours.split('-')
      frontendHours[day] = { isOpen: true, open, close }
    } else {
      frontendHours[day] = { isOpen: false, open: '', close: '' }
    }
  })
  return frontendHours
}