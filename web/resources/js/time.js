export function format(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffHours = diffMs / 1000 / 60 / 60

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    if (diffHours < 24) {
        return `${hours}:${minutes}`
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')

    if (date.getFullYear() === now.getFullYear()) {
        return `${day}/${month}`
    }

    return `${day}/${month}/${date.getFullYear()}`
}
