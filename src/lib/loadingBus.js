const listeners = new Set()

let state = {
  active: false,
  path: null,
  loaded: 0,
  total: 0,
  progress: 0,
}

function emit() {
  for (const fn of listeners) fn(state)
}

export function reportStart(path) {
  state = { active: true, path, loaded: 0, total: 0, progress: 0 }
  emit()
}

export function reportProgress(path, loaded, total) {
  if (state.path !== path) return
  const safeTotal = total > 0 ? total : 0
  state = {
    ...state,
    active: true,
    loaded,
    total: safeTotal,
    progress: safeTotal > 0 ? Math.min(1, loaded / safeTotal) : 0,
  }
  emit()
}

export function reportDone(path) {
  if (path && state.path !== path) return
  state = { ...state, active: false, loaded: state.total || state.loaded, progress: state.total > 0 ? 1 : 0 }
  emit()
}

export function resetLoading() {
  state = { active: false, path: null, loaded: 0, total: 0, progress: 0 }
  emit()
}

export function subscribe(fn) {
  listeners.add(fn)
  fn(state)
  return () => listeners.delete(fn)
}

export function getSnapshot() {
  return state
}
