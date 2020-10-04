import { isRef, unref, isReactive, toRaw } from 'vue'

export class ConfigurationError extends Error {
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = ConfigurationError.name
  }
}

export function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[DataTable] ' + message + ". This warning doesn't show in production.")
  }
}

class DebugLogger {
  log(message: string, obj: any = undefined) {
    if (process.env.NODE_ENV === 'debug') {
      message = '[DataTable] ' + message
      if (obj) {
        if (isRef(obj)) {
          message += ' (ref): '
          obj = unref(obj)
        } else if (isReactive(obj)) {
          message += ' (reactive): '
          obj = toRaw(obj)
        }
        console.debug(message, obj)
      } else {
        console.debug(message)
      }
    }
  }

  success(message: string, obj: any = undefined) {
    this.log('✅ ' + message, obj)
  }

  run(message: string, obj: any = undefined) {
    this.log('🚀 ' + message, obj)
  }
}

export const debug = new DebugLogger()
