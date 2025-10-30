import express from 'express';
import cors from 'cors';
import { prisma } from './prisma';
import { suggestCategory } from './categorize';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

app.get('/categories', async (_req, res) => {
  res.json(await prisma.category.findMany({ orderBy: { name: 'asc' } }));
});

app.post('/categories', async (req, res) => {
  const { name } = req.body ?? {};
  if (!name) return res.status(400).json({ error: 'name required' });
  res.status(201).json(await prisma.category.create({ data: { name } }));
});

app.get('/expenses', async (req, res) => {
  const { from, to } = req.query as { from?: string; to?: string };
  res.json(await prisma.expense.findMany({
    where: {
      ...(from ? { date: { gte: new Date(from) } } : {}),
      ...(to   ? { date: { lte: new Date(to) } } : {}),
    },
    include: { category: true },
    orderBy: { date: 'desc' },
  }));
});

app.post('/expenses', async (req, res) => {
  const { amount, date, merchant, note, categoryId } = req.body ?? {};
  if (!amount || !date || !merchant) return res.status(400).json({ error: 'amount, date, merchant required' });

  let catId = categoryId as number | undefined;
  if (!catId) {
    const name = suggestCategory(`${merchant} ${note ?? ''}`);
    const cat = await prisma.category.upsert({ where: { name }, update: {}, create: { name }});
    catId = cat.id;
  }

  const exp = await prisma.expense.create({
    data: { amount: parseFloat(String(amount)), date: new Date(date), merchant, note, categoryId: catId }
  });
  res.status(201).json(exp);
});

app.delete('/expenses/:id', async (req, res) => {
  await prisma.expense.delete({ where: { id: Number(req.params.id) }});
  res.status(204).end();
});

app.get('/reports/summary', async (req, res) => {
  const { from, to } = req.query as { from?: string; to?: string };
  const where = {
    ...(from ? { date: { gte: new Date(from) } } : {}),
    ...(to   ? { date: { lte: new Date(to) } } : {}),
  };
  const groups = await prisma.expense.groupBy({
    by: ['categoryId'],
    _sum: { amount: true },
    where,
  });
  const names = Object.fromEntries((await prisma.category.findMany()).map(c => [c.id, c.name]));
  const total = groups.reduce((a, g) => a + Number(g._sum.amount || 0), 0);
  res.json({
    total,
    byCategory: groups.map(g => ({ category: names[g.categoryId ?? 0] ?? 'Uncategorized', amount: Number(g._sum.amount || 0) })),
  });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`API on :${PORT}`));
