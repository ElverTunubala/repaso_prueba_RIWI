import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // Ruta para crear un Payment Intent
  @Post('create-payment-intent')
  async createPaymentIntent(@Body('amount') amount: number) {
    const paymentIntent = await this.stripeService.createPaymentIntent(amount, 'usd');
    return {
      clientSecret: paymentIntent.client_secret, // Retorna el client_secret para confirmar el pago en el frontend
    };
  }
}
