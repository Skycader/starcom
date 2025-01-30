import { ChangeDetectorRef, Component } from '@angular/core';
import { TimeEnum } from '../../models/time.list.enum';
import {
  Persistance,
  PersistanceService,
} from '../../../common/services/persistance.service';
import { StorageService } from '../../../storage/services/storage.service';
import { keys } from '../../../sweetbox/resources/keys.resource';
import { interval, tap } from 'rxjs';

export class Mission {
  private disabledUntil = 0;
  private prizeModified = false;
  private progress = 0;
  private requiredProgress = 0;
  private isCompletedUntil = 0;
  private stats: any = {
    progress: 0,
    disabledUntil: Date.now(),
    isCompletedUntil: Date.now(),
  };

  constructor(
    public title: string,
    private step: number,
    private refreshTime: number,
    private respawnTime: number,
    private persistance: PersistanceService,
    private storage: StorageService,
    private prize: { keyType: number; amount: number; xp: number },
    private autocomplete: boolean = false,
  ) {
    this.stats = this.loadMissionStats(this.title) || this.stats;
    this.disabledUntil = this.stats.disabledUntil;
    this.progress = this.stats.progress;
    this.isCompletedUntil = this.stats.isCompletedUntil;
    this.refreshTodo();
    this.init();
  }

  unblock() {
    this.autocomplete = false;
  }

  setProgress(progress: number) {
    this.progress = progress;
  }

  setRequiredProgress(progress: number) {
    this.requiredProgress = progress;
  }

  public getConfig() {
    return {
      step: this.step,
      refreshTime: this.formatDuration(this.refreshTime),
      respawnTime: this.formatDuration(this.respawnTime),
      autocomplete: this.autocomplete,
      xp: this.prize.xp,
    };
  }

  public formatDuration(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d`;
    }
    if (hours > 0) {
      return `${hours}h`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return `${seconds}s`;
  }

  public today() {
    let day = new Date().toISOString().split('T')[0]; //2025-01-27
    // day = '2025-01-28';
    return day;
  }

  public setPrize(keyType: number, amount: number, xp?: number) {
    if (this.prizeModified) return;
    this.prize = { keyType, amount, xp: xp ? xp : this.prize.xp };
    this.prizeModified = true;
  }

  public getPrize() {
    return this.prize;
  }

  public refreshTodo() {
    if (this.stats.todoDate === undefined) this.stats.todoDate = this.today();

    if (this.stats.todoDate !== this.today()) {
      this.stats.todoDate = this.today();
      this.stats.progress = 0;
      this.stats.isCompletedUntil = 0;
      this.stats.disabledUntil = 0;
      this.disabledUntil = 0;
      this.progress = 0;
      this.isCompletedUntil = 0;
    }
  }

  public complete() {
    this.progress += this.step;

    this.stats.progress = this.progress;

    this.disabledUntil = Date.now() + this.refreshTime;

    this.stats.disabledUntil = this.disabledUntil;

    if (this.progress < 100) {
      const audio = new Audio(`assets/audio/level-up.m4a`);
      audio.play();
    }
    if (this.progress >= 100) {
      const audio = new Audio(`assets/audio/mission-complete.m4a`);
      audio.play();

      this.storage.addItem(keys[this.prize.keyType], this.prize.amount);
      this.progress = 0;
      this.stats.progress = this.progress;
      this.isCompletedUntil = Date.now() + this.respawnTime;
      this.stats.isCompletedUntil = this.isCompletedUntil;
    }

    const missions = this.persistance.getItem('missions') || [];
    missions[this.title] = this.stats;
    this.persistance.setItem('missions', missions);
  }

  public isDisabled() {
    return this.disabledUntil > Date.now();
  }

  public isCompleted() {
    return this.isCompletedUntil > Date.now();
  }

  public getProgress() {
    return this.progress;
  }

  public getRequiredProgress() {
    return this.requiredProgress;
  }

  public loadMissionStats(title: string) {
    if (this.persistance.getItem('missions')) {
      return this.persistance.getItem('missions')[title];
    } else {
      this.persistance.setItem('missions', {});
      return null;
    }
  }

  public init() {
    if (!this.persistance.getItem('missions')) {
      this.persistance.setItem('missions', {});
    }

    const missions = this.persistance.getItem('missions');
    missions[this.title] = this.stats;
    this.persistance.setItem('missions', missions);
  }
}

@Component({
  selector: 'app-missions-list',
  templateUrl: './missions-list.component.html',
  styleUrl: './missions-list.component.scss',
})
export class MissionsListComponent {
  public missions: Mission[] = [
    new Mission(
      'Выполните все ежедневные миссии в течении суток, чтобы получить эту награду',
      100,
      10 * TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 1, amount: 3, xp: 1000 },
      true,
    ),
    new Mission(
      '❤️  Отчистить Memos',
      50,
      6 * TimeEnum.HOUR,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 2, xp: 100 },
    ),
    new Mission(
      'Memos - добавить 1 карточку',
      100,
      0,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 200 },
    ),
    new Mission(
      '1 практика японского языка на дуолинго',
      25,
      TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 50 },
    ),
    new Mission(
      'Сделать 1 новый урок японского на дуолинго',
      25,
      TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 100 },
    ),
    new Mission(
      'Сделать 10 упражнений на морязнку',
      25,
      TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 50 },
    ),
    new Mission(
      'Упражнение "Велиосипед" - махи ногами лёжа 100 раз',
      20,
      10 * TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 50 },
    ),
    new Mission(
      'Сделать 10 отжиманий',
      20,
      TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 100 },
    ),
    new Mission(
      'Сделать 20 скручиваний',
      20,
      TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 40 },
    ),
    new Mission(
      'Сделать 10 приседаний',
      20,
      TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 40 },
    ),
    new Mission(
      'Сделать растяжку ног на кухне',
      20,
      TimeEnum.HOUR,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 20 },
    ),
    new Mission(
      'Сделать растяжку ног на коврике - с дисками гантелей',
      25,
      TimeEnum.HOUR,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 200 },
    ),
    new Mission(
      'Растяжка - продольный шпагат на полу',
      25,
      TimeEnum.HOUR,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 200 },
    ),
    new Mission(
      'Растяжка - поперечный шпагат у стенки',
      50,
      3 * TimeEnum.HOUR,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 400 },
    ),
    new Mission(
      'Махи ногами - 20 каждой ногой',
      50,
      10 * TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 200 },
    ),
    new Mission(
      '100 сжиманий кулаков - с эспандером',
      10,
      1 * TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 10 },
    ),
    new Mission(
      '2-х минутная тренировка прочности костяшек кулаков',
      10,
      10 * TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 70 },
    ),
    new Mission(
      'Сделать Широ Оби но Ката',
      50,
      6 * TimeEnum.HOUR,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 100 },
    ),
    new Mission(
      'Собрать кубик рубика',
      50,
      3 * TimeEnum.HOUR,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 100 },
    ),
    new Mission(
      'Прочитать 1 главу книги',
      50,
      TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 2, xp: 500 },
    ),
    new Mission(
      'Убить демона в Raptorium',
      50,
      TimeEnum.HOUR,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 100 },
    ),
    new Mission(
      'Решить случайное regexp задание',
      50,
      10 * TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 250 },
    ),
    new Mission(
      'Съесть яблоко',
      100,
      TimeEnum.HOUR,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 50 },
    ),
    new Mission(
      'Принять душ + холодный душ + 100 раз попрыгать',
      50,
      TimeEnum.HOUR,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 200 },
    ),
    new Mission(
      'Тренировка икроножных мышц - 100 раз',
      25,
      10 * TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 75 },
    ),
  ];

  public rareMissions: Mission[] = [
    new Mission(
      'Сходить на тренировку по каратэ',
      100,
      TimeEnum.HOUR,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 1, amount: 1, xp: 1000 },
    ),
    new Mission(
      'Дрон нашел ключ',
      100,
      TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 0, amount: 1, xp: 10 },
    ),
    new Mission(
      'Прочитать дополнительно 5 глав за день (клик за 1 главу)',
      20,
      TimeEnum.MINUTE,
      TimeEnum.DAY,
      this.persistance,
      this.storage,
      { keyType: 1, amount: 1, xp: 750 },
    ),
    new Mission(
      'Победить в шахматах используя The World',
      100,
      6 * TimeEnum.HOUR,
      TimeEnum.MINUTE,
      this.persistance,
      this.storage,
      { keyType: 1, amount: 1, xp: 500 },
    ),
  ];
  public epicMissions: Mission[] = [
    new Mission(
      'Сделать домашку по Java курсу',
      100,
      6 * TimeEnum.HOUR,
      TimeEnum.MINUTE,
      this.persistance,
      this.storage,
      { keyType: 2, amount: 3, xp: 2500 },
    ),
  ];
  public legendaryMissions: Mission[] = [
    new Mission(
      'Миссия Минимализм',
      100,
      6 * TimeEnum.HOUR,
      TimeEnum.MINUTE,
      this.persistance,
      this.storage,
      { keyType: 3, amount: 1, xp: 5000 },
    ),
    new Mission(
      'Завершить Java курс',
      100,
      6 * TimeEnum.HOUR,
      TimeEnum.MINUTE,
      this.persistance,
      this.storage,
      { keyType: 3, amount: 1, xp: 10000 },
    ),
    new Mission(
      'Завершить чтение "Взломать Всё"',
      100,
      6 * TimeEnum.HOUR,
      TimeEnum.MINUTE,
      this.persistance,
      this.storage,
      { keyType: 3, amount: 1, xp: 5000 },
    ),
  ];

  constructor(
    private persistance: PersistanceService,
    private storage: StorageService,
    private cdk: ChangeDetectorRef,
  ) { }

  public loading = true;
  public finish = false;
  public hideCompletedMissions = true;

  public toggle() {
    this.hideCompletedMissions = !this.hideCompletedMissions;
  }

  public areAllMissionsComplete() {
    const missions = this.missions.slice(1);

    let allMissionsComplete = true;
    let totalPercentage = 0;
    let requiredTotalPercentage = (this.missions.length - 1) * 100;

    missions.forEach((mission: Mission) => {
      if (!mission.isCompleted()) allMissionsComplete = false;
      totalPercentage +=
        mission.getProgress() + Number(mission.isCompleted()) * 100;
    });

    if (allMissionsComplete) {
      return this.missions[0].unblock();
    }

    this.missions[0].setProgress(
      Math.floor((totalPercentage / requiredTotalPercentage) * 100),
    );

    this.missions[0].setRequiredProgress(
      Math.floor(
        ((this.getSecondsToday() - 8 * 60 * 60) / (12 * 60 * 60)) * 100,
      ),
    );
  }

  public getSecondsToday() {
    let now = new Date();

    // create an object using the current day/month/year
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let diff = now.getTime() - today.getTime(); // ms difference
    return Math.round(diff / 1000); // make seconds
  }

  public randomBonus() {
    const key = new Date().toISOString().split('T')[0];
    const key2 = new Date().toISOString().split('T')[0] + '#2';
    const randomNum = getRandomNumber(key, 0, this.missions.length - 1);
    const randomNum2 = getRandomNumber(key2, 0, this.missions.length - 1);
    this.missions[randomNum].setPrize(
      0,
      this.missions[randomNum].getPrize().amount * 3,
    );
    this.missions[randomNum2].setPrize(
      0,
      this.missions[randomNum2].getPrize().amount * 2,
    );
  }

  ngOnInit() {
    const audio = new Audio(`assets/audio/menu.mp3`);
    audio.volume = 0.3;
    audio.play();
    setTimeout(() => {
      this.loading = false;
    }, 0);
    setTimeout(() => {
      this.finish = true;
    }, 500);
  }

  public update$ = interval(100).pipe(
    tap(() => {
      this.randomBonus();
      this.cdk.detectChanges();
      this.areAllMissionsComplete();
    }),
  );

  // Используем функцию, передавая необходимый ID
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i); // hash = hash * 31 + charCode
    hash |= 0; // Приведение к 32-битному целому
  }
  return hash;
}

function getRandomNumber(key: string, min: number, max: number): number {
  const hash = hashCode(key);
  const range = max - min + 1;
  // Используем модуль, чтобы результат был в пределах от 0 до range-1
  return min + (Math.abs(hash) % range);
}
