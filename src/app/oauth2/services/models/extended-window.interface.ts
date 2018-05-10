export interface IExtendedWindow extends Window {
  setOauthParams: (callingWindow: Window, tokenMap: Map<string, string>) => void;
}
