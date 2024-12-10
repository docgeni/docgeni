/**
 * General Button Component description.
 * @name alib-button
 */
@Component({
    selector: 'alib-button,[alibButton]',
    template: '<ng-content></ng-content>',
})
export class AlibButtonComponent implements OnInit {
    @HostBinding(`class.dg-btn`) isBtn = true;

    private type: string;
    private loading = false;

    /**
     * Button Type: `'primary' | 'secondary' | 'danger'`
     * @description 按钮类型
     * @default primary
     * @type 'primary' | 'secondary' | 'danger'
     */
    @Input() set alibButton(value: string) {
        this.alibType = value;
    }

    /**
     * 和 alibButton 含义相同，一般使用 alibButton，为了减少参数输入, 设置按钮组件通过 alib-button 时，只能使用该参数控制类型
     * @default primary
     */
    @Input() set alibType(value: string) {
        if (this.type) {
            this.elementRef.nativeElement.classList.remove(`dg-btn-${this.type}`);
        }
        this.type = value;
        this.elementRef.nativeElement.classList.add(`dg-btn-${this.type}`);
    }

    /**
     * Button Size
     * @default md
     */
    @Input() alibSize: 'xs' | 'sm' | 'md' | 'lg' = 'xs';

    /**
     * Input  of alib button component
     * @type string
     */
    @Input('alibAliasName') alibLengthTooLongLengthTooLong: 'TypeLengthTooLongLengthTooLongLengthTooLong';

    /**
     * Button loading status
     * @default false
     */
    @Input() set thyLoading(loading: boolean) {
        this.loading = loading;
    }

    /**
     * Loading Event
     */
    @Output() thyLoadingEvent = new EventEmitter<boolean>();

    @ContentChild('template') templateRef: TemplateRef<unknown>;

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {}
}
js;
