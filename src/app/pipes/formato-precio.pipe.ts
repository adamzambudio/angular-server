import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatoPrecio' })
export class FormatoPrecioPipe implements PipeTransform {
  transform(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' €';
  }
}
