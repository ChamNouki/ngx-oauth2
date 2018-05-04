# ngx-oauth2

>This module allows you to automatically be redirect to FedId on 401 server response. Its development is based on [angular-library-starter](https://github.com/robisim74/angular-library-starter#4) project.

## Contents

* [1 Using the library](#1)
* [2 Project structure](#2)
* [3 Developing](#3)
* [4 Testing](#4)
* [5 Building](#5)
* [6 Publishing](#6)
* [7 Documentation](#7)
* [8 Some important things to know](#8)

## <a name="1"></a>1 Using the library

### Installing

```Shell
npm install ngx-oauth2 --save
```

### Loading

#### Using SystemJS configuration

```JavaScript
System.config({
    map: {
        'ngx-oauth2': 'node_modules/ngx-oauth2/bundles/ngx-oauth2.umd.js'
    }
});
```

#### Angular-CLI

No need to set up anything, just import it in your code.

#### Rollup or webpack

No need to set up anything, just import it in your code.

#### Plain JavaScript

Include the `umd` bundle in your `index.html`:

```Html
<script src="node_modules/ngx-oauth2/bundles/ngx-oauth2.umd.js"></script>
```

and use global `ngx.OAuth2` namespace.

### AoT compilation

This module is compatible with _AoT compilation_.

### Library usage

#### Basic usage

Just import the module and give him the API Management's provided clientId which allow your front application to communicate to your API.

```Typescript
@NgModule({
    imports: [
        ...,
        OAuth2Module.forRoot({clientId: '', loginEndpoint: ''})
    ],
    providers: [...],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

To enable module authentication process you juste have to add the OAuth2Interceptor as an HTTP_INTERCEPTORS provider in your module :

```Typescript
@NgModule({
    imports: [
        ...,
        OAuth2Module.forRoot({clientId: '', loginEndpoint: ''})
    ],
    providers: [
        ...,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: OAuth2Interceptor,
            multi: true,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

And you just have to use the HttpClient service the regular way.

#### Advanced configuration

* `apiKeys?: {[urlPattern: string]: string};`
* `logoutEndpoint?: string;`
* `userEndpoint?: string;`

#### OAuth2Service

* `isConnected(): boolean`
* `login(): Observable<Map<string, string>>`
* `logout(): Observable<{}>`
* `userInfo<T>(): Observable<T>`
* `token(): OAuth2Token`

#### Guards

##### OAuth2ConnectedGuard

You can use this guard to activate a route only if a valid token is present in the application.

##### OAuth2VisitorGuard

You can use this guard to activate a route only if there isn't token in the application.

##### Protecting all routes in your application

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

### Additional information

All authentication information are only stored in memory.

## <a name="2"></a>2 Project structure

* Library:

  * **src** folder for the classes
  * **public_api.ts** entry point for all public APIs of the package
  * **package.json** _npm_ options
  * **rollup.config.js** _Rollup_ configuration for building the bundles
  * **tsconfig-build.json** _ngc_ compiler options for _AoT compilation_
  * **build.js** building process using _ShellJS_

* Testing:

  * **tests** folder for unit & integration tests
  * **karma.conf.js** _Karma_ configuration that uses _webpack_ to build the tests
  * **spec.bundle.js** defines the files used by _webpack_

* Extra:

  * **tslint.json** _TypeScript_ linter rules with _Codelyzer_
  * **travis.yml** _Travis CI_ configuration

## <a name="3"></a>3 Developing

1. Update [Node & npm](https://docs.npmjs.com/getting-started/installing-node).
1. Clone this project
1. run `npm install`.
1. Create your classes in `src` folder, and export public classes in `ngx-oauth2.ts`.
1. You can create only one _module_ for the whole library: I suggest you create different _modules_ for different functions, so that the user can import only those he needs and optimize _Tree shaking_ of his app.
1. Update in `rollup.config.js` file `globals` libraries with those that actually you use.
1. Create unit & integration tests in `tests` folder, or unit tests next to the things they test in `src` folder, always using `.spec.ts` extension. _Karma_ is configured to use _webpack_ only for `*.ts` files: if you need to test different formats, you have to update it.

## <a name="4"></a>4 Testing

The following command run unit & integration tests that are in the `tests` folder, and unit tests that are in `src` folder:

```Shell
npm test
```

## <a name="5"></a>5 Building

The following command:

```Shell
npm run build
```

* starts _TSLint_ with _Codelyzer_
* starts _AoT compilation_ using _ngc_ compiler
* creates `dist` folder with all the files of distribution

To test locally the npm package:

```Shell
npm run pack-lib
```

Then you can install it in an app to test it:

```Shell
npm install [path]my-library-[version].tgz
```

## <a name="6"></a>6 Publishing

Only Jenkins can successfully exec this script.

```Shell
npm run publish-lib
```

## <a name="7"></a>7 Documentation

To generate the documentation, this starter uses [compodoc](https://github.com/compodoc/compodoc):

```Shell
npm run compodoc
npm run compodoc-serve
```

## <a name="8"></a>8 Some important things to know

1. `package.json`

    * `"main": "./bundles/ngx-oauth2.umd.js"` legacy module format
    * `"module": "./bundles/ngx-oauth2.es5.js"` flat _ES_ module, for using module bundlers such as _Rollup_ or _webpack_:
    [package module](https://github.com/rollup/rollup/wiki/pkg.module)
    * `"es2015": "./bundles/ngx-oauth2.js"` _ES2015_ flat _ESM_ format, experimental _ES2015_ build
    * `"peerDependencies"` the packages and their versions required by the library when it will be installed

1. `tsconfig.json` file used by _TypeScript_ compiler

    * Compiler options:
        * `"strict": true` enables _TypeScript_ `strict` master option

1. `tsconfig-build.json` file used by _ngc_ compiler

    * Compiler options:
        * `"declaration": true` to emit _TypeScript_ declaration files
        * `"module": "es2015"` & `"target": "es2015"` are used by _Rollup_ to create the _ES2015_ bundle

    * Angular Compiler Options:
        * `"skipTemplateCodegen": true,` skips generating _AoT_ files
        * `"annotateForClosureCompiler": true` for compatibility with _Google Closure compiler_
        * `"strictMetadataEmit": true` without emitting metadata files, the library will not compatible with _AoT compilation_

1. `rollup.config.js` file used by _Rollup_

    * `format: 'umd'` the _Universal Module Definition_ pattern is used by _Angular_ for its bundles
    * `moduleName: 'ngx.OAuth2'` defines the global namespace used by _JavaScript_ apps
    * `external` & `globals` declare the external packages

1. Server-side prerendering

    If you want the library will be compatible with server-side prerendering:
    * `window`, `document`, `navigator` and other browser types do not exist on the server
    * don't manipulate the _nativeElement_ directly

## License

Apache 2
