import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

/**
 * Add here external dependencies that actually you use.
 *
 * Angular dependencies
 * - '@angular/animations' => 'ngx.animations'
 * - '@angular/animations/browser': 'ngx.animations.browser'
 * - '@angular/common' => 'ngx.common'
 * - '@angular/compiler' => 'ngx.compiler'
 * - '@angular/core' => 'ngx.core'
 * - '@angular/forms' => 'ngx.forms'
 * - '@angular/common/http' => 'ngx.common.http'
 * - '@angular/platform-browser-dynamic' => 'ngx.platformBrowserDynamic'
 * - '@angular/platform-browser' => 'ngx.platformBrowser'
 * - '@angular/platform-browser/animations' => 'ngx.platformBrowser.animations'
 * - '@angular/platform-server' => 'ngx.platformServer'
 * - '@angular/router' => 'ngx.router'
 *
 * RxJS dependencies
 * Each RxJS functionality that you use in the library must be added as external dependency.
 * - For main classes use 'Rx':
 *      e.g. import { Observable } from 'rxjs/Observable'; => 'rxjs/Observable': 'Rx'
 * - For observable methods use 'Rx.Observable':
 *      e.g. import 'rxjs/add/observable/merge'; => 'rxjs/add/observable/merge': 'Rx.Observable'
 *      or for lettable operators:
 *      e.g. import { merge } from 'rxjs/observable/merge'; => 'rxjs/observable/merge': 'Rx.Observable'
 * - For operators use 'Rx.Observable.prototype':
 *      e.g. import 'rxjs/add/operator/map'; => 'rxjs/add/operator/map': 'Rx.Observable.prototype'
 *      or for lettable operators:
 *      e.g. import { map } from 'rxjs/operators'; => 'rxjs/operators': 'Rx.Observable.prototype'
 *
 * Other dependencies
 * - Angular libraries: refer to their global namespace
 * - TypeScript/JavaScript libraries:
 *      e.g. lodash: 'lodash' => 'lodash'
 *
 * Also, if the dependency uses CommonJS modules, such as lodash,
 * you should also use a plugin like rollup-plugin-commonjs,
 * to explicitly specify unresolvable "named exports".
 *
 */
const globals = {
  '@angular/core': 'ngx.core',
  '@angular/common': 'ngx.common',
  '@angular/common/http': 'ngx.common.http',
  '@angular/router': 'ngx.router',
  'rxjs/Observable': 'Rx',
  'rxjs/Observer': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/Subscription': 'Rx',
  'rxjs/add/observable/defer': 'Rx.Observable',
  'rxjs/add/observable/of': 'Rx.Observable',
  'rxjs/add/observable/empty': 'Rx.Observable',
  'rxjs/add/observable/from': 'Rx.Observable',
  'rxjs/add/operator/filter': 'Rx.Observable.prototype',
  'rxjs/add/operator/switchMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/scan': 'Rx.Observable.prototype',
  'rxjs/add/operator/takeWhile': 'Rx.Observable.prototype',
  'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/retryWhen': 'Rx.Observable.prototype',
  'moment': 'moment'
};

export default {
  external: Object.keys(globals),
  plugins: [resolve(), sourcemaps()],
  onwarn: () => { return },
  output: {
    format: 'umd',
    name: 'ngx.oauth2',
    globals: globals,
    sourcemap: true,
    exports: 'named',
    amd: { id: 'ngx-oauth2' }
  }
}
