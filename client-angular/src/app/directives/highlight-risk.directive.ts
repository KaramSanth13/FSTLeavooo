import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightRisk]',
  standalone: true
})
export class HighlightRiskDirective implements OnChanges {
  @Input('appHighlightRisk') riskTag: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.riskTag === 'High Load') {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '5px solid #ef4444');
      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'rgba(239, 68, 68, 0.05)');
    } else if (this.riskTag === 'Risky') {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '5px solid #f59e0b');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', 'none');
      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
    }
  }
}
