import { getRepository, getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();

      if (value > balance.total) {
        throw new AppError(
          `You don't have a valid balance to execute an outcome type transaction`,
        );
      }
    }

    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    let transaction;

    if (checkCategoryExists) {
      transaction = transactionsRepository.create({
        title,
        value,
        // category: checkCategoryExists or category_id: checkCategoryExists.id
        category_id: checkCategoryExists.id,
        type,
      });
    } else {
      const createdCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(createdCategory);

      transaction = transactionsRepository.create({
        title,
        value,
        // category: createdCategory or category_id: createdCategory.id
        category_id: createdCategory.id,
        type,
      });
    }

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
