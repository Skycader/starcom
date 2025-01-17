import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatSliderModule } from '@angular/material/slider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatPaginatorModule } from '@angular/material/paginator';
const MaterialComponents = [
  MatSliderModule,
  MatButtonModule,
  MatRippleModule,
  MatMenuModule,
  MatTooltipModule,
  MatIconModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatBadgeModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatInputModule,
  MatTabsModule,
  MatCardModule,
  MatSelectModule,
  MatTableModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatListModule,
  MatChipsModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, DragDropModule],
  exports: [...MaterialComponents, DragDropModule],
})
export class MaterialModule { }
