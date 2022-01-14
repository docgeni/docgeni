import { Component, OnInit, HostBinding, Input, ElementRef, Output, EventEmitter, Injectable } from '@angular/core';

/**
 * General Button Component description.
 */
@Component({
    selector: 'alib-button,[alibButton]',
    template: '<ng-content></ng-content>'
})
export class AlibButtonComponent implements OnInit {
    @HostBinding(`class.dg-btn`) isBtn = true;

    private type: string;
    private loading = false;

    /**
     * Button Type: `'primary' | 'secondary' | 'danger'`
     * @description.zh-cn 按钮类型，类型为 `'primary' | 'secondary' | 'danger'`
     * @default primary
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

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {}
}

@Injectable({
    providedIn: 'root'
})
export class ButtonService {
    /**
     * Open a button
     *
     * @param {string} pram1
     * @param {number} pram2
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
