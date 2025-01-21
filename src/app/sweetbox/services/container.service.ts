import { Injectable } from '@angular/core';
import { commonContainer } from '../containers/common.config';
import { ItemModelInterface } from '../models/item.model';
import { ContainerType } from '../models/container.type';
import { rareContainer } from '../containers/rare.config';

@Injectable({
  providedIn: 'root',
})
export class ContainerService {
  constructor() { }

  public generateContainer(cards: number, containerType: ContainerType) {
    const container: ItemModelInterface[] = [];
    while (cards--) {
      if (containerType === 'common')
        container.push(commonContainer.getRandomElement());
      if (containerType === 'rare')
        container.push(rareContainer.getRandomElement());
    }
    return container;
  }
}
