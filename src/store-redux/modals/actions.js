export default {

  open: (name, resultCallback = () => {}) => {
    return {type: 'modal/open', payload: { name, resultCallback }};
  },

  close: () => {
    return {type: 'modal/close'}
  }
}
