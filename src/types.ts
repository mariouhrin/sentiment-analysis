export type Products = {
  name: string;
  description: string;
};

export type ParsedCsvToJSON = Products[];

export type RegExpParts = {
  pattern: string;
  flag: string;
};

export type ProductsWithScore = Array<{
  name: string;
  description: string;
  score: number;
}>;

export type ProductsTopSentiment = {
  topPositive: Products;
  topNegative: Products;
};
