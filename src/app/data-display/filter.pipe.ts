import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dataSearch' })
export class DataSearchPipe implements PipeTransform {
  public transform(data: any[], searchText: any): any {
    if (searchText == null || data == null) {
      return data;
    }
    return data.filter(chartData => chartData.pattern.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }
}
