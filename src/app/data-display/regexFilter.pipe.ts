import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'regexdataSearch' })
export class RegexFilterPipe implements PipeTransform {
  public transform(data: any[], searchText: any): any {
    if (searchText == null || data == null) {
      return data;
    }
    const regex = new RegExp(searchText);
    return data.filter(chartData => chartData.pattern.match(regex));
  }
}
