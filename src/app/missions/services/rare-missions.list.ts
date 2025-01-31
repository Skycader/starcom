import { Injectable } from '@angular/core';
import { Mission } from './mission.class';
import { MissionConfig, MissionsService } from './missions.service';
import { TimeEnum } from '../models/time.list.enum';

@Injectable({
  providedIn: 'root',
})
export class RareMissions {
  constructor(private mission: MissionsService) { }

  private rareMissions: MissionConfig[] = [
    {
      title: '🥋 Сходить на тренировку по каратэ',
      step: 100,
      refreshTime: TimeEnum.HOUR,
      respawnTime: TimeEnum.DAY,
      reward: { keyType: 1, amount: 1, xp: 4000 },
    },
    {
      title: '🛸 Дрон нашел ключ',
      step: 100,
      refreshTime: TimeEnum.MINUTE,
      respawnTime: TimeEnum.DAY,
      reward: { keyType: 0, amount: 1, xp: 40 },
    },
    {
      title: '📖 Прочитать дополнительно 5 глав за день (клик за 1 главу)',
      step: 20,
      refreshTime: TimeEnum.MINUTE,
      respawnTime: TimeEnum.DAY,
      reward: { keyType: 1, amount: 1, xp: 2000 },
    },
    {
      title: '♟ Победить в шахматах используя The World',
      step: 100,
      refreshTime: 6 * TimeEnum.HOUR,
      respawnTime: TimeEnum.MINUTE,
      reward: { keyType: 1, amount: 1, xp: 1000 },
    },
  ];

  public get(): Mission[] {
    return this.rareMissions.map((mission) => this.mission.make(mission));
  }
}
