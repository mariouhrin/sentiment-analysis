import path from 'path';

import { sentimentAnalysis } from './sentiment-analysis';

/**
 * execute sentiment analysis
 */
const pathToCsvFile = path.join(__dirname, '/data/dataset-gymbeam-product-descriptions-eng.csv');

sentimentAnalysis(pathToCsvFile);
