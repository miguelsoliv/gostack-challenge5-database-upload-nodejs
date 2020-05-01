import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const checkTransactionExists = await transactionRepository.findOne(id);

    if (checkTransactionExists) {
      await transactionRepository.delete({ id: checkTransactionExists.id });
    } else {
      throw new AppError('Transaction not found', 400);
    }
  }
}

export default DeleteTransactionService;
