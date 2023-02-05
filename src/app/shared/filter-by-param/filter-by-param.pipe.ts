import { Pipe, PipeTransform } from '@angular/core';
import { isString } from './is-string';
import { IProduct } from '../products/product.interface';

@Pipe({
	name: 'filterByParam',
})
export class FilterByParamPipe implements PipeTransform {
	transform<T, P extends keyof T>(
		items: T[] | undefined | null,
		searchValue: T[P] | null,
		searchProperty: P,
	): T[] | undefined | null {
		return items?.filter(item => {
			const propertyValue = item[searchProperty];
			return isString(propertyValue)
				? propertyValue.toLowerCase().includes((searchValue as unknown as string)?.toLowerCase())
				: propertyValue === searchValue;
		});
	}
}
