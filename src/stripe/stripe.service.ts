import { Injectable, Inject } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    // Configura Stripe con la clave secreta desde las variables de entorno
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
     
    });
  }

  // Método para crear un Payment Intent
  async createPaymentIntent(amount: number, currency: string) {
    try {
      return await this.stripe.paymentIntents.create({
        amount,
        currency,
      });
    } catch (error) {
      throw new Error(`Stripe error: ${error.message}`);
    }
  }
}
