export const REG_EXP_PATTERNS = {
  htmlTagOmit: {
    pattern: '(<([^>]+)>)',
    flag: 'ig'
  },
  onlyAlphaCharacters: {
    pattern: '[^a-zA-Z\\s-]+',
    flag: 'g'
  },
  removeLineBreaks: {
    pattern: '/\r\n|\n|\r/gm',
    flag: 'gm'
  }
} as const;
