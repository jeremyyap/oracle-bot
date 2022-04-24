import { v2 } from '@google-cloud/translate';

const translate = new v2.Translate();

export async function translateText(input) {
  const [result, metadata] = await translate.translate(input, 'en');
  console.log(metadata);
  return result;
}
