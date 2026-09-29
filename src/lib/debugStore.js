let currentState = null
const listeners = new Set()

let cameraMode = false
const camListeners = new Set()

export function registerDebug(info) {
  currentState = info
  listeners.forEach(fn => fn(info))
  return () => {
    if (currentState === info) {
      currentState = null
      listeners.forEach(fn => fn(null))
    }
  }
}

export function subscribe(fn) {
  listeners.add(fn)
  if (currentState) fn(currentState)
  return () => listeners.delete(fn)
}

export function setCameraMode(enabled) {
  cameraMode = enabled
  camListeners.forEach(fn => fn(enabled))
}

export function subscribeCameraMode(fn) {
  camListeners.add(fn)
  fn(cameraMode)
  return () => camListeners.delete(fn)
}
