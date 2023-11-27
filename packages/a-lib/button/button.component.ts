import {
    Component,
    ContentChild,
    Directive,
    ElementRef,
    EventEmitter,
    Injectable,
    Input,
    OnInit,
    Output,
    Pipe,
    PipeTransform,
    TemplateRef
} from '@angular/core';

@Directive()
class Base {
    /**
     * Disabled
     * @order 10
     */
    @Input() alibDisabled!: boolean;
}
/**
 * General Button Component description.
 * @name alib-button
 * @order 1
 */
@Component({
    selector: 'alib-button,[alibButton]',
    template: '<ng-content></ng-content>',
    host: {
        class: 'dg-btn'
    }
})
export class AlibButtonComponent extends Base implements OnInit {
    private type!: string;
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
    @Input('alibAliasName') alibLengthTooLongLengthTooLong!: 'TypeLengthTooLongLengthTooLongLengthTooLong';

    /**
     * Button loading status
     */
    @Input() thyLoading = false;

    /**
     * Loading Event
     */
    @Output() thyLoadingEvent = new EventEmitter<boolean>();

    @ContentChild('template') templateRef!: TemplateRef<unknown>;

    constructor(private elementRef: ElementRef<HTMLElement>) {
        super();
    }

    ngOnInit(): void {}

    /**
     * Disable Button
     * @public
     */
    disable(): void {}
}

/**
 * Button Service
 * @name ButtonService
 * @order 2
 */
@Injectable({
    providedIn: 'root'
})
export class ButtonService {
    /**
     * Open a button
     *
     * @param {string} pram1 pram1 desc
     * @param {number} pram2 pram2 desc
     * @memberof ButtonService
     * @returns Return of
     */
    open(pram1: string, pram2: number): void {}

    /**
     * Close Button
     * @param {string} id id desc
     */
    close(id: string): void {}
}

/**
 * 把文本转换成全大写形式
 * @public
 * @name uppercase
 * @order 10
 */
@Pipe({
    name: 'uppercase',
    standalone: true
})
export class UpperCasePipe implements PipeTransform {
    constructor() {}

    /**
     * 大写转换
     * @public
     * @param {string} value 输入值
     * @param {string} defaultValue 转不成大写时候的默认值
     * @returns {string}
     */
    transform(value: string, defaultValue: string): string {
        if (typeof value !== 'string') {
            return defaultValue;
        }
        return value.toUpperCase();
    }
}
