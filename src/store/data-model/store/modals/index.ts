export interface ModalWindow {
  name: string,
  params: any,
  resolve: (value: any) => unknown
}

export interface ModalsValues {
  opened: ModalWindow[]
}
