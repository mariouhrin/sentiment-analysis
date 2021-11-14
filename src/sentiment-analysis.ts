import { WordTokenizer, SentimentAnalyzer, PorterStemmer } from 'natural';
import stopword from 'stopword';
const aposToLexForm = require('apos-to-lex-form');

import { parseCsvToJSON, regExpReplace, getTopAndBottomProductsByScore, getTopTenWordsUsed, printTopSentimentProducts } from './utils';
import { ProductsWithScore } from './types';
import { REG_EXP_PATTERNS } from './constants';
import { logger } from './logger';

export function descriptionDataPreparation(data: string): string {
  /**
   * remove html tags
   */
  const dataRemovedHtmlTags = regExpReplace(data, REG_EXP_PATTERNS.htmlTagOmit);

  /**
   * convert text data to lex form and lowercase
   */
  const dataToLexForm: string = aposToLexForm(dataRemovedHtmlTags);
  const dataToLowerCase = dataToLexForm.toLocaleLowerCase();

  /**
   * extract only alpha character and remove number and special characters
   */
  const dataOnlyAlphaCharacters = regExpReplace(dataToLowerCase, REG_EXP_PATTERNS.onlyAlphaCharacters);

  return dataOnlyAlphaCharacters;
}

export function tokenizeAndRemoveStopWords(data: string): string[] {
  /**
   * break text into an array of tokens
   */
  const tokenizer = new WordTokenizer();
  const dataTokenizedWords = tokenizer.tokenize(data);

  /**
   * remove all stop words (units, letters and words like: for, an, nor, but, or, yet, so)
   */
  const metrics = ['mg', 'kg', 'ml'];
  const alphabetLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const allStopWords = [...stopword.en, ...metrics, ...alphabetLetters];
  const dataRemovedStopWords = stopword.removeStopwords(dataTokenizedWords, allStopWords);

  return dataRemovedStopWords;
}

export function sentimentAnalysis(pathToCsvFile: string): void {
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

  const productsWithScore: ProductsWithScore = [];
  const descriptionWords: string[] = [];

  const dataCsv = parseCsvToJSON(pathToCsvFile);

  for (const product of dataCsv) {
    /**
     * prepare product description data for sentiment analysis
     */
    const descriptionDataProcessed = descriptionDataPreparation(product.description);
    const descriptionDataForAnalysis = tokenizeAndRemoveStopWords(descriptionDataProcessed);

    const productScore = analyzer.getSentiment(descriptionDataForAnalysis);

    /**
     * store sentiment score and all description words
     */
    productsWithScore.push({
      name: product.name,
      description: regExpReplace(product.description, REG_EXP_PATTERNS.htmlTagOmit),
      score: productScore
    });

    descriptionWords.push(...descriptionDataForAnalysis);
  }

  /**
   * get ithe most positive and negative products by sentiment score
   * and print the results
   */
  const topSentimentProducts = getTopAndBottomProductsByScore(productsWithScore);
  const { topPositive, topNegative } = topSentimentProducts;

  logger.info(printTopSentimentProducts(topPositive.name, topPositive.description, 'positive'));
  logger.info(printTopSentimentProducts(topNegative.name, topNegative.description, 'negative'));

  /**
   * get the top 10 most frequently used words in product descriptions
   * and print the results
   */
  const skipWords = ['will', 'it', 'not'];
  const topTenWords = getTopTenWordsUsed(descriptionWords, skipWords);

  const topTenWordsWithRank = topTenWords.map((word: string, index: number) => `${index + 1}. ${word}`);

  logger.info(`
  Top 10 most frequently used words in product descriptions \r\n
  ${JSON.stringify(topTenWordsWithRank, null, 2)}
  `);
}
