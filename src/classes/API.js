export default class API {
  constructor(sheet) {
    this.sheet = sheet
    this.db = null
  }

  init() {
    return new Promise((resolve) => {
      const req = indexedDB.open('customTrainingDB', 2)
      req.onsuccess = (e) => {
        this.db = e.target.result
        resolve()
      }

      req.onupgradeneeded = (e) => {
        this.db = e.target.result
        if (!this.db.objectStoreNames.contains('questions')) {
          this.db.createObjectStore('questions', { keyPath: 'id', autoIncrement: true })
        }
        if (!this.db.objectStoreNames.contains('history')) {
          this.db.createObjectStore('history', { keyPath: 'id' })
        }
      }
    })
  }

  getStore() {
    return this.db.transaction([this.sheet], 'readwrite').objectStore(this.sheet)
  }

  get() {
    return new Promise(
      (resolve) => (this.getStore().getAll().onsuccess = (e) => resolve(e.target.result))
    )
  }

  add(val) {
    return new Promise(
      (resolve) =>
        (this.getStore().add(JSON.parse(JSON.stringify(val))).onsuccess = () => resolve())
    )
  }

  put(val) {
    return new Promise(
      (resolve) =>
        (this.getStore().put(JSON.parse(JSON.stringify(val))).onsuccess = () => resolve())
    )
  }

  del(id) {
    return new Promise((resolve) => (this.getStore().delete(id).onsuccess = () => resolve()))
  }

  clear() {
    return new Promise((resolve) => (this.getStore().clear().onsuccess = () => resolve()))
  }
}
