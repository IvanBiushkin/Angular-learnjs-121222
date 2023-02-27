import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { IProductsFilter } from './products-filter.interface';

@Component({
	selector: 'app-products-filter',
	templateUrl: './products-filter.component.html',
	styleUrls: ['./products-filter.component.less'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsFilterComponent implements OnInit, OnChanges {
	@Input() brands!: string[] | null;

	@Output() changeFilter = new EventEmitter<IProductsFilter>();

	readonly filterForm = new FormGroup({
		name: new FormControl('', { validators: [Validators.minLength(2)] }),
		brands: new FormArray<FormControl>([]),
		priceRange: new FormGroup({
			min: new FormControl(0),
			max: new FormControl(10000),
		}),
	});

	get filterFormControl(): FormControl {
		return this.filterForm.get(['priceRange', 'min']) as FormControl;
	}

	ngOnChanges({ brands }: SimpleChanges): void {
		if (brands && this.brands) {
			this.initBrandsFormArray();
		}
	}

	ngOnInit(): void {
		this.filterForm.valueChanges
			.pipe(
				map(
					({ brands, ...filter }): IProductsFilter =>
						({
							...filter,
							brands: this.getBrandsListFromCheckboxes(brands),
						} as IProductsFilter),
				),
			)
			.subscribe(filter => {
				this.changeFilter.emit(filter);
			});
	}

	private initBrandsFormArray() {
		const brandsControls: FormControl<boolean>[] = this.brands?.map(
			() => new FormControl<boolean>(true),
		) as FormControl<boolean>[];

		this.filterForm.setControl('brands', new FormArray(brandsControls));
	}

	private getBrandsListFromCheckboxes(brandsCheckboxes: boolean[] | undefined): IProductsFilter['brands'] {
		if (!this.brands || !brandsCheckboxes) {
			return [];
		}

		return this.brands.filter((_, index) => brandsCheckboxes[index]);
	}
}
