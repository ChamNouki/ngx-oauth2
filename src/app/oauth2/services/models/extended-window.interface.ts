export interface IExtendedWindow extends Window {
  setOauthParams: (callingWindow: Window, callbackParams: Map<string, string>) => void;
}
