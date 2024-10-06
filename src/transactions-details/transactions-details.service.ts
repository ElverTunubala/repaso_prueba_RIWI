import { Injectable } from '@nestjs/common';
import { CreateTransactionsDetailDto } from './dto/create-transactions-detail.dto';
import { UpdateTransactionsDetailDto } from './dto/update-transactions-detail.dto';

@Injectable()
export class TransactionsDetailsService {
  create(createTransactionsDetailDto: CreateTransactionsDetailDto) {
    return 'This action adds a new transactionsDetail';
  }

  findAll() {
    return `This action returns all transactionsDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionsDetail`;
  }

  update(id: number, updateTransactionsDetailDto: UpdateTransactionsDetailDto) {
    return `This action updates a #${id} transactionsDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionsDetail`;
  }
}
