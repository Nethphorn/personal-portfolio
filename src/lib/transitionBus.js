const listeners = new Set()
let readyFn = null

export function onTransition(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function fireTransition() {
  listeners.forEach(fn => fn())
}

export function onPageReady(fn) {
  readyFn = fn
  return () => { if (readyFn === fn) readyFn = null }
}

export function signalPageReady() {
  readyFn?.()
}
