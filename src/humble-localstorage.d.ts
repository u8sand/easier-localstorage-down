declare module 'humble-localstorage' {
  export const length: number
  export function getItem(key: string): string | null
  export function setItem(key: string, val: string | number | boolean): void
  export function removeItem(key: string): void
  export function clear(): void
  export function key(index: number): string | null

  export function getObject(key: string)
  export function setObject(key: string, obj: any): void
  export const isPersistent: boolean
}
