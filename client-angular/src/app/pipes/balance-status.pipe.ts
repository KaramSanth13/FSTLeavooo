import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'balanceStatus',
  standalone: true
})
export class BalanceStatusPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= 3) return 'Critical';
    if (value <= 5) return 'Low';
    return 'Healthy';
  }
}
