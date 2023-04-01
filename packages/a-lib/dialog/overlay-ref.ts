export abstract class AbstractOverlayRef<T> {
    /**
     * The instance of the dialog component.
     **/
    instance: T;

    abstract onClose(): void;
}
