//@flow
import R from 'ramda'

export type Stream = {
  listeners: Array<Function>,
  values: Array<Object>
}

const stream = (): Stream => (
  {
    listeners: [],
    values: [],
  }
)

const pushToStream = (stream: Stream, value:any, debug:boolean = false):Stream => {
  debug && console.log({stream, value})
  const values = R.append(value, stream.values)
  stream.listeners.map(listener => {
    debug && console.log({listener, value})
    listener.call(null, value)
  })
  return R.merge(stream, { values })
}

const addListener = (stream: Stream, listener:Function):Stream => {
  const listeners = R.append(listener, stream.values)
  return R.merge(stream, { listeners })
}

const valuesMap = (functor: Function, stream: Stream) => {
  return R.map(functor, stream.values) 
}

export {
  stream,
  pushToStream,
  addListener
}
