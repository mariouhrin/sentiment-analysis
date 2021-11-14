import parse from 'csv-parse/lib/sync';
import fs from 'fs';
import pluralize from 'pluralize';

import { ParsedCsvToJSON, RegExpParts, ProductsWithScore, ProductsTopSentiment } from './types';
import { REG_EXP_PATTERNS } from './constants';

export function parseCsvToJSON(pathToCsvFile: string): ParsedCsvToJSON {
  const fileContent = fs.readFileSync(pathToCsvFile, 'utf8');

  const csvToJsonData = parse(fileContent, {
    columns: true,
    delimiter: ','
  }) as ParsedCsvToJSON;

  return csvToJsonData;
}

export function regExpReplace(data: string, regExParts: RegExpParts): string {
  const regExpPattern = new RegExp(regExParts.pattern, regExParts.flag);
  return data.replace(regExpPattern, '');
}

export function getTopAndBottomProductsByScore(products: ProductsWithScore): ProductsTopSentiment {
  const sortProductsByScore = products.sort((a, b) => b.score - a.score);

  const mostPositiveByScore = sortProductsByScore[0];
  const mostNegativeByScore = sortProductsByScore[sortProductsByScore.length - 1];

  return {
    topPositive: {
      name: mostPositiveByScore.name,
      description: mostPositiveByScore.description
    },
    topNegative: {
      name: mostNegativeByScore.name,
      description: mostNegativeByScore.description
    }
  };
}

export function getTopTenWordsUsed(words: string[], skipWords: string[] = []): string[] {
  const wordFrequency: Record<string, number> = {};

  for (const word of words) {
    const wordSingular = pluralize.singular(word);

    if (!wordFrequency.hasOwnProperty(wordSingular)) {
      wordFrequency[wordSingular] = 0;
    }

    if (skipWords.includes(wordSingular)) {
      continue;
    }

    wordFrequency[wordSingular] += 1;
  }

  const sortWordsByCount = Object.keys(wordFrequency).sort((a, b) => wordFrequency[b] - wordFrequency[a]);

  const topTenWordsByCount = sortWordsByCount.slice(0, 10);

  return topTenWordsByCount;
}

export function printTopSentimentProducts(name: string, description: string, flag: 'positive' | 'negative'): string {
  return `
  The most ${flag} product description by sentiment score \r\n
  Product name:
  ${name} \r\n
  Product description:
  ${regExpReplace(description, REG_EXP_PATTERNS.removeLineBreaks)}
  `;
}
