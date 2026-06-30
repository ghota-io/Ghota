const STORAGE_KEY = 'ghota_theme'

export function getPersistedTheme() {
    try {
        return localStorage.getItem(STORAGE_KEY)
    } catch {
        return null
    }
}

export function setPersistedTheme(t) {
    try {
        if (t) {
            localStorage.setItem(STORAGE_KEY, t)
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    } catch {
        // localStorage may be unavailable
    }
}
