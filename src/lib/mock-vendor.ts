export type StoredVendor = {
  fullName: string;
  email: string;
  password: string;
  preferredLanguage?: 'en' | 'ml';
};

const STORAGE_KEY = 'vendor-market-user';

export function readStoredVendor(): StoredVendor | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredVendor;
  } catch {
    return null;
  }
}

export function writeStoredVendor(vendor: StoredVendor) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vendor));
}

export function clearStoredVendor() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function signInVendor(email: string, password: string) {
  const vendor = readStoredVendor();
  if (!vendor) return null;
  if (vendor.email.toLowerCase() !== email.toLowerCase()) return null;
  if (vendor.password !== password) return null;
  return vendor;
}
