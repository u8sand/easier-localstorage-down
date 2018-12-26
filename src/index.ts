import expose, { EasierLevelDOWN } from 'easier-abstract-leveldown'
import humbleLocalStorage from 'humble-localstorage'
import { range } from './range'

type LocalStorageDOWNConfig = {
  location?: string
}

class LocalStorageDOWN implements EasierLevelDOWN<string, string, LocalStorageDOWNConfig> {
  _prefix: string = ''

  _key(k: string): string {
    return this._prefix + k
  }

  async open({ location }) {
    if (location !== undefined)
      this._prefix = '!' + location + '!'
    else
      this._prefix = ''
  }

  async get(k) {
    const v = humbleLocalStorage.getItem(this._key(k))
    if (v === null)
      throw new Error('NotFound')
    return v
  }

  async put(k: string, v: string) {
    humbleLocalStorage.setItem(this._key(k), v)
  }

  async del(k) {
    humbleLocalStorage.removeItem(this._key(k))
  }

  async *iterator(opts) {
    const keys = [...range(
      humbleLocalStorage.length
    )].map( // get keys
      (i) => humbleLocalStorage.key(i)
    ).filter( // filter by prefix
      (k) => k.slice(0, this._prefix.length) === this._prefix
    ).map( // remove prefix
      (k) => k.slice(this._prefix.length)
    ).sort() // sort keys

    if (opts.reverse) keys.reverse()

    for (const k of keys) {
      yield {
        key: k,
        value: humbleLocalStorage.getItem(this._key(k))
      }
    }
  }
}

export default expose(LocalStorageDOWN)
