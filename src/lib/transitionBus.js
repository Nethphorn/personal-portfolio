const listeners = new Set()
let readyFn = null

const progressListeners = new Set()
let progress = 0

export function onTransition(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function fireTransition() {
  resetProgress()
  listeners.forEach(fn => fn())
}

export function onPageReady(fn) {
  readyFn = fn
  return () => { if (readyFn === fn) readyFn = null }
}

export function signalPageReady() {
  reportProgress(1)
  readyFn?.()
}

export function reportProgress(value) {
  progress = Math.max(progress, Math.min(1, value || 0))
  progressListeners.forEach(fn => fn(progress))
}

export function onProgress(fn) {
  progressListeners.add(fn)
  fn(progress)
  return () => progressListeners.delete(fn)
}

export function resetProgress() {
  progress = 0
  progressListeners.forEach(fn => fn(progress))
}
