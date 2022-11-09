export type State = {
  isLoading:boolean;
  loginRequestStatus: 'error' | 'success' | 'nao enviado',
  isLogged?: boolean
}
