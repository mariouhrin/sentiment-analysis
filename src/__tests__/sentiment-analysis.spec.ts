import path from 'path';

import { descriptionDataPreparation, tokenizeAndRemoveStopWords, sentimentAnalysis } from './../sentiment-analysis';
import { logger } from '../logger';

describe('sentiment analysis functions', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('descriptionDataPreparation', () => {
    it('should return processed product description data', () => {
      const descriptionData =
        '<p><strong>BCAA 4:1:1 </strong>Instant contains instant <strong>branched chain amino acids, L-Leucine, L-Isoleucine and L-Valine</strong> in a <strong>4:1:1</strong> ratio. They are needed for the production of proteins. Proteins are an essential part of muscle tissue, and they make one <strong>third of muscle proteins</strong>. The <strong>organism</strong> <strong>can not create them by itself</strong> and they must be taken from the <strong>diet</strong> and in the form of <strong>nutritional supplements.</strong></p>';

      const result = descriptionDataPreparation(descriptionData);

      const expectedResult =
        'bcaa  instant contains instant branched chain amino acids l-leucine l-isoleucine and l-valine in a  ratio they are needed for the production of proteins proteins are an essential part of muscle tissue and they make one third of muscle proteins the organism can not create them by itself and they must be taken from the diet and in the form of nutritional supplements';

      expect(result).toBe(expectedResult);
    });
  });

  describe('tokenizeAndRemoveStopWords', () => {
    it('should return tokenized array without stop words', () => {
      const descriptionProcessedData =
        'bcaa  instant contains instant branched chain amino acids l-leucine l-isoleucine and l-valine in a  ratio they are needed for the production of proteins proteins are an essential part of muscle tissue and they make one third of muscle proteins the organism can not create them by itself and they must be taken from the diet and in the form of nutritional supplements';

      const result = tokenizeAndRemoveStopWords(descriptionProcessedData);

      const expectedResult = [
        'bcaa',
        'instant',
        'contains',
        'instant',
        'branched',
        'chain',
        'amino',
        'acids',
        'leucine',
        'isoleucine',
        'valine',
        'ratio',
        'needed',
        'production',
        'proteins',
        'proteins',
        'essential',
        'part',
        'muscle',
        'tissue',
        'one',
        'third',
        'muscle',
        'proteins',
        'organism',
        'not',
        'create',
        'itself',
        'taken',
        'diet',
        'form',
        'nutritional',
        'supplements'
      ];

      expect(result).toEqual(expectedResult);
    });
  });

  describe('sentimentAnalysis', () => {
    it('should perform sentiment analysis and print the expected results', () => {
      const loggerMock = jest.spyOn(logger, 'info');
      const pathToCsvFile = path.join(__dirname, '../data/dataset-gymbeam-product-descriptions-eng.csv');

      sentimentAnalysis(pathToCsvFile);

      expect(loggerMock).toHaveBeenCalledTimes(3);

      const expectedFirstResult = 'The most positive product description by sentiment score';
      expect(loggerMock).toHaveBeenNthCalledWith(1, expect.stringMatching(expectedFirstResult));

      const expectedSecondResult = 'The most negative product description by sentiment score';
      expect(loggerMock).toHaveBeenNthCalledWith(2, expect.stringMatching(expectedSecondResult));

      const expectedThirdResult = 'Top 10 most frequently used words in product descriptions';
      expect(loggerMock).toHaveBeenNthCalledWith(3, expect.stringMatching(expectedThirdResult));
    });
  });
});
