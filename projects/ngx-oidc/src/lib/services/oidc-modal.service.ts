import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Type
} from '@angular/core';

@Injectable()
export class OIDCModalService {
  private modalRef: ComponentRef<any>;
  private hostDomElement: Element;

  private disposeFn: (() => void) | null;

  constructor(private appRef: ApplicationRef,
              private injector: Injector,
              private resolverFactory: ComponentFactoryResolver) {
  }

  public dispose() {
    if ( this.disposeFn ) {
      this.disposeFn();
      this.disposeFn = null;
    }
  }

  public open<T>(component: Type<T>) {
    if ( this.modalRef != null ) {
      this.dispose();
    }

    this.modalRef = this.resolverFactory.resolveComponentFactory(component).create(this.injector);
    this.appRef.attachView(this.modalRef.hostView);

    this.hostDomElement = this.appRef.components[0].location.nativeElement;
    this.hostDomElement.appendChild(this.getComponentRootNode());

    this.setDisposeFn(() => {
      this.appRef.detachView(this.modalRef.hostView);
      this.modalRef.destroy();
    });
  }

  private setDisposeFn(fn: () => void) {
    this.disposeFn = fn;
  }

  private getComponentRootNode() {
    return (this.modalRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }
}
