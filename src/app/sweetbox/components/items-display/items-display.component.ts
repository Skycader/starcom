import { Component, Inject } from '@angular/core';
import { commonContainer } from '../../containers/common.config';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { rareContainer } from '../../containers/rare.config';
import { legendaryContainer } from '../../containers/legendary.config';
import { epicContainer } from '../../containers/epic.config';

@Component({
  selector: 'app-items-display',
  templateUrl: './items-display.component.html',
  styleUrl: './items-display.component.scss',
})
export class ItemsDisplayComponent {
  public containers = {
    common: commonContainer,
    rare: rareContainer,
    epic: epicContainer,
    legendary: legendaryContainer,
  };

  public items = this.containers[this.data.containerType]
    .filter(onlyUnique)
    .map((item) => {
      return {
        ...item,
        probability: (
          (this.containers[this.data.containerType].reduce(
            (total, element) =>
              element.title === item.title ? (total += 1) : total,
            0,
          ) /
            this.containers[this.data.containerType].length) *
          100
        ).toFixed(2),
      };
    });

  public container = commonContainer;

  ngOnInit() { }

  public dict = {
    common: 'Обычный предмет',
    food: 'Еда',
    rare: 'Редкий предмет',
    epic: 'Эпический предмет',
    legendary: 'Легендарный предмет',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { containerType: 'common' | 'rare' | 'epic' | 'legendary' },
  ) { }
}

function onlyUnique(value: any, index: any, array: any) {
  return array.indexOf(value) === index;
}
