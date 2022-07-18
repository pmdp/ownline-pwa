export const ID_LOGGED_IN = 'isLoggedIn'
export const ID_COOKIE_EXPIRATION_TIME = 'cookieExpiredAt'

export const LocalStorageService = {
  get (key) {
    return window.localStorage.getItem(key)
  },
  getBoolean (key) {
    return JSON.parse(window.localStorage.getItem(key))
  },
  getInt (key) {
    return parseInt(window.localStorage.getItem(key))
  },
  set (key, value) {
    window.localStorage.setItem(key, value)
  },
  remove (key) {
    window.localStorage.removeItem(key)
  }
}
// export default LocalStorageService
