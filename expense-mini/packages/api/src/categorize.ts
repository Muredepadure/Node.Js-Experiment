type Rule = { keywords: string[]; category: string };

const rules: Rule[] = [
  { keywords: ['uber','bus','train','fuel','gas','shell'], category: 'Transport' },
  { keywords: ['walmart','aldi','lidl','grocery','supermarket'], category: 'Groceries' },
  { keywords: ['starbucks','kfc','mcdonald','restaurant','pizza','cafe'], category: 'Restaurants' },
  { keywords: ['netflix','spotify','cinema','movie'], category: 'Entertainment' },
  { keywords: ['pharmacy','drug','doctor','clinic'], category: 'Health' },
  { keywords: ['electric','water','internet','utility','bill'], category: 'Utilities' },
  { keywords: ['amazon','shop','store'], category: 'Shopping' }
];

export function suggestCategory(text: string): string {
  const t = text.toLowerCase();
  for (const r of rules) if (r.keywords.some(k => t.includes(k))) return r.category;
  return 'Other';
}
