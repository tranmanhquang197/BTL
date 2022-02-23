import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[pattern-directive]'
})

export class PatternDirective {

    private navigationKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'Home',
        'End',
        'ArrowLeft',
        'ArrowRight',
        'Clear',
        'Copy',
        'Paste'
    ];

    @Input('regPattern')
    set regPattern(reg: string) {
        if (reg) {
            this.$regPatternString = reg
            this.$regPattern = new RegExp(reg);
        }

    }

    $regPatternString = '';
    $regPattern = new RegExp('');
    inputElement: HTMLElement;

    constructor(public el: ElementRef) {
        this.inputElement = el.nativeElement;
    }

    // @Output() valueChange = new EventEmitter()
    // @HostListener('input', ['$event']) onInputChange(event: any) {
    //   console.log('input changeeeeeeeeeeeeeeeeeeeeeee')
    //   const initalValue = this.el.nativeElement.value;
    //   const newValue = initalValue.replace(/[^0-9]*/g, '');
    //   this.el.nativeElement.value = newValue;
    //   this.valueChange.emit(newValue);
    //   if ( initalValue !== this.el.nativeElement.value) {
    //     event.stopPropagation();
    //   }
    // }
    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        if (
            this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
            (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
            (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
            (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
            (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
            (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
            (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
            (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
            (e.key === 'x' && e.metaKey === true) // Allow: Cmd+X (Mac)
        ) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        // if (
        //   (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
        //   (e.keyCode < 96 || e.keyCode > 105)
        // ) {
        //   console.log('eeeeeeeeeeeeeeeeeeeee',e)
        //   e.preventDefault();
        // }

        if (!e.key.match(this.$regPattern)) {
            e.preventDefault();
            return;
        }
        const current: string = this.el.nativeElement.value;
        // @ts-ignore
        const next: string = current ? current.concat(e.key) : e.key;
        // console.log('curentttttttttt', current, next, this.el.nativeElement)
        // @ts-ignore
      if (!next || !next.replaceAll(',', '').match(this.$regPattern)) {
            e.preventDefault();
        }


    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        let data: string | undefined = '';
        const pastedInput = event.clipboardData?.getData('text/plain'); // get a digit-only string

        if (this.$regPatternString !== null && this.$regPatternString !== undefined && this.$regPatternString !== '') {


            for (let i = 0; pastedInput && i < pastedInput?.length; i++) {
                if (pastedInput[i].match(this.$regPattern)) {
                    data = data.concat(pastedInput[i])
                }
            }
        } else {
            data = pastedInput
        }
        console.log('dataaaaa', data);


        document.execCommand('insertText', false, data);
    }

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        event.preventDefault();
        const textData = event.dataTransfer?.getData('text').replace(/\D/g, '');
        this.inputElement.focus();
        document.execCommand('insertText', false, textData);
    }


}
