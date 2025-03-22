export const useShowAlert = () => {
  return async (...args: any) => {
    await window.electron.ipcRenderer.invoke('/show-alert', ...args)
  }
}
