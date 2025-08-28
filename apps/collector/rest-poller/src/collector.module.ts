import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CollectorService } from './collector.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CollectorService],
})
export class CollectorRestModule {}
