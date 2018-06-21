# NgxOauth2 [![Build Status](https://travis-ci.org/ChamNouki/ngx-oauth2.svg?branch=master)](https://travis-ci.org/ChamNouki/ngx-oauth2)

This module allows you to automatically be redirect to any OAuth2 SSO on 401 server response.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.

## Installing

```Shell
npm install ngx-oauth2 --save
```
## Library usage

### Basic usage

Just import the module and give him the API Management's provided client_id which allow your front application to communicate to your API, and the url of the discovery endpoint of your OpenId SSO.

```Typescript
@NgModule({
    imports: [
        ...,
        OAuth2Module.forRoot({client_id: '', endpoints_discovery: ''})
    ],
    providers: [...],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

And you just have to use the HttpClient service the regular way.

### Advanced configuration

This module configuration follow the [OpenId connect meta-data convention](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata). So you can specify or override any configuration.

Keep in mind that the module require at least the `authorization_endpoint` config value, and optionally the `userinfo_endpoint` to retrieve user information. 

### OAuth2Service

* `isConnected(): boolean`
* `login(): Observable<void | OpenIdUser>`
* `logout(): Observable<void>`
* `userInfo<OpenIdUser>(): Observable<T>`
* `getAuthorizationHeader(): string`

### Guards

#### OAuth2ConnectedGuard

You can use this guard to activate a route only if a valid token is present in the application.

#### OAuth2VisitorGuard

You can use this guard to activate a route only if there isn't token in the application.

#### Protecting all routes in your application

The best way to protect all your application is to use the OAuth2ConnectedGuard on a global route :

```Typescript
export const routingTable: Routes = [
  {
    path: '',
    canActivate: [OAuth2ConnectedGuard],
    children: [
      ... // all of your application routes goes here
    ]
  }
];
```
