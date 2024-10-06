import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}