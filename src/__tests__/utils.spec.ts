import path from 'path';

import * as utils from './../utils';
import { REG_EXP_PATTERNS } from './../constants';
import { ProductsWithScore } from './../types';
import { descriptionWords } from './__mocks__/description-words.mock';

describe('utils functions', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('parseCsvToJSON', () => {
    const pathToCsvFile = path.join(__dirname + '/__mocks__/example.csv');

    it('should return parsed csv file data as JSON', () => {
      const result = utils.parseCsvToJSON(pathToCsvFile);

      const expectedResult = [
        { name: 'Product 1', description: 'the best product' },
        { name: 'Product 2', description: 'the newest product' }
      ];

      expect(result).toEqual(expectedResult);
    });

    it('should return error due to wrong file path', () => {
      const expectedError = `ENOENT: no such file or directory, open 'wrong path to csv file'`;

      expect(() => utils.parseCsvToJSON('wrong path to csv file')).toThrow(expectedError);
    });
  });

  describe('regExpReplace', () => {
    it('should remove html tags', () => {
      const textData = `<p><span class=""null"">Ronnie Fitness Belt is a <strong>quality leather belt</strong> designed for training, made of flexible split leather.</span></p>`;

      const result = utils.regExpReplace(textData, REG_EXP_PATTERNS.htmlTagOmit);

      const expectedResult = `Ronnie Fitness Belt is a quality leather belt designed for training, made of flexible split leather.`;

      expect(result.replace(/\s/g, '')).toBe(expectedResult.replace(/\s/g, ''));
    });

    it('should extract only alphabet characters', () => {
      const textData = 'The number 1 product in the planet !!';

      const result = utils.regExpReplace(textData, REG_EXP_PATTERNS.onlyAlphaCharacters);

      const expectedResult = 'The number  product in the planet ';

      expect(result).toBe(expectedResult);
    });

    it('should remove line breaks', () => {
      const textData = 'The long description \n\n';

      const result = utils.regExpReplace(textData, REG_EXP_PATTERNS.removeLineBreaks);

      const expectedResult = 'The long description ';

      expect(result).toBe(expectedResult);
    });
  });

  describe('getTopAndBottomProductsByScore', () => {
    it('should return the most positive and negative product by sentiment score', () => {
      const productsWithScore: ProductsWithScore = [
        { name: 'Caffeine', description: 'stimulant', score: 0.5 },
        { name: 'Protein', description: 'for volume', score: 0.9 },
        { name: 'Maltodextrin ', description: 'energy', score: 0.2 },
        { name: 'Amino', description: 'recovery', score: 0.6 }
      ];

      const result = utils.getTopAndBottomProductsByScore(productsWithScore);

      const expectedResult = {
        topPositive: { name: 'Protein', description: 'for volume' },
        topNegative: { name: 'Maltodextrin ', description: 'energy' }
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getTopTenWordsUsed', () => {
    it('should return the top 10 most frequently used words', () => {
      const skipWords = ['will'];

      const result = utils.getTopTenWordsUsed(descriptionWords, skipWords);

      const expectedResult = ['protein', 'vitamin', 'healthy', 'contain', 'acid', 'body', 'crunchy', 'form', 'fiber', 'snack'];

      expect(result).toEqual(expectedResult);
    });

    it('should return the top 10 most frequently used words without skipWords', () => {
      const result = utils.getTopTenWordsUsed(descriptionWords);

      const expectedResult = ['protein', 'vitamin', 'will', 'healthy', 'contain', 'acid', 'body', 'crunchy', 'form', 'fiber'];

      expect(result).toEqual(expectedResult);
    });
  });

  describe('printTopSentimentProducts', () => {
    it('should return expected text result', () => {
      const name = 'Protein';
      const description = 'Micronized whey protein \n\n';
      const flag = 'positive';

      const result = utils.printTopSentimentProducts(name, description, flag);

      const expectedResult = `The most positive product description by sentiment score
        Product name:
        Protein
        Product description: 
        Micronized whey protein`;

      expect(result.replace(/\s/g, '')).toEqual(expectedResult.replace(/\s/g, ''));
    });
  });
});
