import { Module } from '@nestjs/common';
import { TransactionsDetailsService } from './transactions-details.service';
import { TransactionsDetailsController } from './transactions-details.controller';

@Module({
  controllers: [TransactionsDetailsController],
  providers: [TransactionsDetailsService],
})
export class TransactionsDetailsModule {}
