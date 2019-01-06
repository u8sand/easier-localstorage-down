import expose, { EasierLevelDOWN, EasierLevelDOWNEmitter } from 'easier-abstract-leveldown'
import humbleLocalStorage from 'humble-localstorage'
import { range } from './range'

export type LocalStorageDOWNConfig = {
  location?: string
}

export class LocalStorageDOWN implements EasierLevelDOWN<string, string, LocalStorageDOWNConfig> {
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

  changes() {
    const emitter = new EasierLevelDOWNEmitter<string, string>()
    if (window !== undefined) {
      window.onstorage = (e: StorageEvent) => {
        if (e.key.slice(0, this._prefix.length) === this._prefix) {
          if(e.newValue === null || e.newValue === undefined)
            emitter.emitDel(this._key(e.key))
          else
            emitter.emitPut(this._key(e.key), e.newValue)
        }
      }
    }
    return emitter
  }
}

export default expose(() => new LocalStorageDOWN())
