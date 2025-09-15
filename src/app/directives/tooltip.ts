import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class Tooltip implements OnInit {
  @Input()
  public appTooltip = '';

  private readonly nativeElement: HTMLElement;

  private readonly tooltip: HTMLDivElement;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {
    this.nativeElement = this.elementRef.nativeElement;
    this.tooltip = this.renderer.createElement('div');
  }

  ngOnInit(): void {
    this.renderer.setStyle(this.tooltip, 'opacity', '0');

    this.renderer.setAttribute(this.tooltip, 'class', 'tooltip');

    this.renderer.appendChild(this.nativeElement, this.tooltip);

    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.appTooltip),
    );

    this.setCoordinates(true);

    this.renderer.listen(this.nativeElement, 'mouseenter', () => {
      this.renderer.setStyle(this.tooltip, 'opacity', '1');
      this.setCoordinates();
    });

    this.renderer.listen(this.nativeElement, 'mouseleave', () => {
      this.renderer.setStyle(this.tooltip, 'opacity', '0');
      this.setCoordinates(true);
    });
  }

  private setCoordinates(applyRandomOffset: boolean = false) {
    const yOffset = 100 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    const xOffset = 100 * Math.random() * (Math.random() > 0.5 ? 1 : -1);

    const domRect = this.nativeElement.getBoundingClientRect();

    this.renderer.setStyle(
      this.tooltip,
      'top',
      `${
        domRect.top +
        window.pageYOffset -
        this.tooltip.offsetHeight -
        5 +
        (applyRandomOffset ? yOffset : 0)
      }px`,
    );

    this.renderer.setStyle(
      this.tooltip,
      'left',
      `${domRect.left + window.pageXOffset + (applyRandomOffset ? xOffset : 0)}px`,
    );
  }
}
