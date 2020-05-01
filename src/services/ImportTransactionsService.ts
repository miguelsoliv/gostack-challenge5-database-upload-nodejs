import csvParse from 'csv-parse';
import fs from 'fs';
import { getRepository, In } from 'typeorm';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface TransactionCSV {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  categoryTitle: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getRepository(Transaction);

    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const transactionsFromCSV: TransactionCSV[] = [];
    const categoriesTitlesFromCSV: string[] = [];

    parseCSV.on('data', line => {
      const [title, type, value, categoryTitle] = line;

      if (!title || !type || !value || !categoryTitle) return;

      transactionsFromCSV.push({ title, type, value, categoryTitle });
      categoriesTitlesFromCSV.push(categoryTitle);
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existingCategories = await categoriesRepository.find({
      where: {
        title: In(categoriesTitlesFromCSV),
      },
    });

    const categoriesTitles = existingCategories.map(category => category.title);

    const categoriesToAdd = categoriesTitlesFromCSV
      .filter(categoryTitle => !categoriesTitles.includes(categoryTitle))
      .filter((value, index, thisArray) => thisArray.indexOf(value) === index);

    const addedCategories = categoriesRepository.create(
      categoriesToAdd.map(title => ({ title })),
    );

    const savedCategories = await categoriesRepository.save(addedCategories);

    const allCategories = [...existingCategories, ...savedCategories];

    const addedTransactions = transactionsRepository.create(
      transactionsFromCSV.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: allCategories.find(
          category => category.title === transaction.categoryTitle,
        ),
      })),
    );

    const savedTransactions = await transactionsRepository.save(
      addedTransactions,
    );

    await fs.promises.unlink(filePath);

    return savedTransactions;
  }
}

export default ImportTransactionsService;
