'use client';

import { useEffect, useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';

interface LedgerRow {
  id: string;
  amount_paise: number;
  entry_type: 'sale' | 'purchase' | 'expense' | 'withdrawal' | 'credit_given' | 'credit_repaid';
  payment_method: 'cash' | 'upi' | 'other';
  description: string | null;
  entry_date: string;
}

const labels: Record<LedgerRow['entry_type'], string> = {
  sale: 'Sale',
  purchase: 'Purchase',
  expense: 'Expense',
  withdrawal: 'Withdrawal',
  credit_given: 'Credit given',
  credit_repaid: 'Credit repaid',
};

export default function BusinessBookPage() {
  const [entries, setEntries] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [entryType, setEntryType] = useState<LedgerRow['entry_type']>('sale');
  const [method, setMethod] = useState<LedgerRow['payment_method']>('cash');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState<'all' | LedgerRow['entry_type']>('all');

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('ledger_entries')
      .select('id,amount_paise,entry_type,payment_method,description,entry_date')
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false });
    setEntries((data || []) as unknown as LedgerRow[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function addEntry(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    const paise = Math.round(Number(amount) * 100);
    if (!Number.isFinite(paise) || paise <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc('add_ledger_entry', {
      p_amount_paise: paise,
      p_entry_type: entryType,
      p_payment_method: method,
      p_description: description,
      p_entry_date: new Date().toISOString().slice(0, 10),
      p_idempotency_key: crypto.randomUUID(),
    });
    setSaving(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    setAmount('');
    setDescription('');
    setFormOpen(false);
    await load();
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayEntries = entries.filter((entry) => entry.entry_date === today);
  const sales = todayEntries
    .filter((entry) => entry.entry_type === 'sale')
    .reduce((sum, entry) => sum + entry.amount_paise, 0);
  const outflow = todayEntries
    .filter((entry) => ['purchase', 'expense', 'withdrawal'].includes(entry.entry_type))
    .reduce((sum, entry) => sum + entry.amount_paise, 0);
  const cash = todayEntries
    .filter((entry) => entry.payment_method === 'cash')
    .reduce((sum, entry) => sum + (['sale', 'credit_repaid'].includes(entry.entry_type) ? entry.amount_paise : -entry.amount_paise), 0);
  const filtered = filter === 'all' ? entries : entries.filter((entry) => entry.entry_type === filter);

  function exportCsv() {
    const header = 'Date,Type,Payment Method,Description,Amount INR\n';
    const rows = entries.map((entry) =>
      [entry.entry_date, labels[entry.entry_type], entry.payment_method, `"${(entry.description || '').replaceAll('"', '""')}"`, (entry.amount_paise / 100).toFixed(2)].join(',')
    );
    const blob = new Blob([header + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `business-book-${today}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Daily Business Book</h1>
          <p className="text-text-secondary text-sm mt-1">{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportCsv} disabled={entries.length === 0}>
            <Download className="size-4" /> CSV
          </Button>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="size-4" /> Add entry
          </Button>
        </div>
      </div>

      {formOpen && (
        <Card className="mb-6">
          <form onSubmit={addEntry} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (₹)</label>
              <input type="number" min="0.01" step="0.01" required value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Entry type</label>
              <select value={entryType} onChange={(event) => setEntryType(event.target.value as LedgerRow['entry_type'])} className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]">
                {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment method</label>
              <select value={method} onChange={(event) => setMethod(event.target.value as LedgerRow['payment_method'])} className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]">
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input value={description} maxLength={500} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            </div>
            {error && <p className="text-sm text-danger sm:col-span-2" role="alert">{error}</p>}
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit" isLoading={saving}>Save entry</Button>
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <TrendingUp className="size-4 mx-auto text-primary" />
          <p className="text-xs text-text-secondary mt-1">Total sales</p>
          <p className="text-2xl font-bold text-primary">₹{(sales / 100).toFixed(2)}</p>
        </Card>
        <Card className="text-center">
          <TrendingDown className="size-4 mx-auto text-danger" />
          <p className="text-xs text-text-secondary mt-1">Outflow</p>
          <p className="text-2xl font-bold text-danger">₹{(outflow / 100).toFixed(2)}</p>
        </Card>
        <Card className="text-center col-span-2 sm:col-span-1">
          <Wallet className="size-4 mx-auto text-information" />
          <p className="text-xs text-text-secondary mt-1">Cash movement</p>
          <p className="text-2xl font-bold text-information">₹{(cash / 100).toFixed(2)}</p>
        </Card>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-4">
        {([
          'all',
          'sale',
          'purchase',
          'expense',
          'withdrawal',
          'credit_given',
          'credit_repaid',
        ] as const).map((value) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className="shrink-0 px-3 py-2 rounded-full text-sm border border-divider bg-surface">
            {value === 'all' ? 'All' : labels[value]}
          </button>
        ))}
      </div>

      <Card padded={false}>
        {loading ? (
          <p className="p-8 text-sm text-text-secondary">Loading entries...</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-sm text-text-secondary text-center">No entries found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-divider"><th className="text-left p-3">Date</th><th className="text-left p-3">Type</th><th className="text-left p-3">Description</th><th className="text-right p-3">Amount</th></tr></thead>
              <tbody>{filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-divider last:border-0">
                  <td className="p-3 text-text-secondary whitespace-nowrap">{entry.entry_date}</td>
                  <td className="p-3"><Badge variant="muted">{labels[entry.entry_type]}</Badge></td>
                  <td className="p-3">{entry.description || '—'}</td>
                  <td className="p-3 text-right font-semibold tabular-nums">₹{(entry.amount_paise / 100).toFixed(2)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
