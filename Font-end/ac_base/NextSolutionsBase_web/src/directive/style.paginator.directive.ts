import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Host,
  Inject,
  Input,
  Optional,
  Output,
  Renderer2,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator/paginator';
import { Paging } from '../models/Paging';
import { InjectTokenNextSolutionsConfig, NextSolutionsConfig } from '../modules/next.solutions.config';

@Directive({
  selector: '[style-paginator]',
})

export class StylePaginatorDirective implements AfterViewInit {
  private _currentPage = 1;
  private _pageGapTxt = '...';
  private _rangeStart?: number;
  private _rangeEnd?: number;
  private _buttons: any[] = [];
  private _showTotalPages = 5;

  @Input() get showTotalPages(): number {
    return this._showTotalPages;
  }

  set showTotalPages(value: number) {
    this._showTotalPages = value % 2 == 0 ? value + 1 : value;
  }

  $paging?: Paging;

  @Input() get paging() {
    return this.$paging;
  }

  set paging(paging) {
    if (paging) {
      this.$paging = paging;
      // pageIndex = pageNumber -1
      this.switchPage(paging.pageNumber - 1, false);
    }

  }

  @Output() pagingChangeEvent: EventEmitter<any> = new EventEmitter<any>(); // PageEvent

  constructor(
    @Inject(InjectTokenNextSolutionsConfig) private config: NextSolutionsConfig,
    @Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private vr: ViewContainerRef,
    private ren: Renderer2,
  ) {
    //Sub to rerender buttons when next page and last page is used or choose pageSize
    this.matPag.page.subscribe((pageEvent: PageEvent) => {
      if (this.paging) {
        this.paging.pageSize = pageEvent.pageSize;
      }
      this.switchPage(pageEvent.pageIndex, true);
    });
  }

  private buildPageNumbers() {
    const actionContainer = this.vr.element.nativeElement.querySelector(
      'div.mat-paginator-range-actions',
    );
    const nextPageNode = this.vr.element.nativeElement.querySelector(
      'button.mat-paginator-navigation-next',
    );

    // remove buttons before creating new ones
    if (this._buttons.length > 0) {
      this._buttons.forEach(button => {
        this.ren.removeChild(actionContainer, button);
      });
      //Empty state array
      this._buttons.length = 0;
    }

    //initialize next page and last page buttons
    if (this._buttons.length == 0) {
      let nodeArray = this.vr.element.nativeElement?.childNodes[0]?.childNodes[0]
        ?.childNodes[2]?.childNodes;
      if (nodeArray) {
        setTimeout(() => {
          for (let i = 0; i < nodeArray.length; i++) {
            if (nodeArray[i].nodeName === 'BUTTON') {
              if (nodeArray[i].disabled) {
                this.ren.setStyle(
                  nodeArray[i],
                  'background-color',
                  'rgba(190, 130, 130, 1)',
                );
                this.ren.setStyle(nodeArray[i], 'color', 'white');
                this.ren.setStyle(nodeArray[i], 'margin', '.5%');
              } else {
                this.ren.setStyle(
                  nodeArray[i],
                  'background-color',
                  'rgba(255, 0, 0, 1)',
                );
                this.ren.setStyle(nodeArray[i], 'color', 'white');
                this.ren.setStyle(nodeArray[i], 'margin', '.6%');
              }
            }
          }
        });
      }

    }

    let dots = false;
    if ((!!this._rangeStart || this._rangeStart === 0) && (!!this._rangeEnd || this._rangeEnd === 0)) {
      for (let i = 0; i < this.matPag.getNumberOfPages(); i = i + 1) {
        if ((i < this._showTotalPages &&
          this._currentPage < this._showTotalPages &&
          i > this._rangeStart) ||
          (i >= this._rangeStart && i <= this._rangeEnd)
        ) {
          this.ren.insertBefore(
            actionContainer,
            this.createButton(i, this.matPag.pageIndex),
            nextPageNode,
          );
        } else {
          if (i > this._rangeEnd && !dots) {
            // if (!isNaN(i)) {
            //     this.ren.insertBefore(
            //         actionContainer,
            //         this.createButton(this._pageGapTxt, this.matPag.pageIndex),
            //         nextPageNode
            //     );
            //     dots = true;
            // }

          }
        }
      }
    }

  }

  private createButton(i: any, pageIndex: number): any {
    const linkBtn = this.ren.createElement('mat-button');
    this.ren.addClass(linkBtn, 'mat-mini-fab');
    this.ren.setStyle(linkBtn, 'margin', '1%');

    const pagingTxt = isNaN(i) ? this._pageGapTxt : +(i + 1);
    const text = this.ren.createText(pagingTxt + '');

    this.ren.addClass(linkBtn, 'mat-custom-page');
    switch (i) {
      case pageIndex:
        this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
        break;
      case this._pageGapTxt:
        // this.ren.listen(linkBtn, "click", () => {
        //     this.switchPage(this._currentPage + this._showTotalPages);
        // });
        break;
      default:
        this.ren.listen(linkBtn, 'click', () => {
          this.switchPage(i, true);
        });
        break;
    }

    this.ren.appendChild(linkBtn, text);
    //Add button to private array for state
    this._buttons.push(linkBtn);
    return linkBtn;
  }

  private initPageRange(): void {
    this._rangeStart = this._currentPage - this._showTotalPages / 2;
    this._rangeEnd = this._currentPage + this._showTotalPages / 2;

    this.buildPageNumbers();
  }

  private switchPage(i: number, isEvent: boolean) {
    this._currentPage = i;
    this.matPag.pageIndex = i;
    if (isEvent) {
      this.pagingChangeEvent.emit({
        pageIndex: i,
        pageSize: this.paging ? this.paging.pageSize : this.config.PAGE_SIZE,
      });
    }

    this.initPageRange();
  }

  public ngAfterViewInit() {
    this.initPageRange();
  }
}
