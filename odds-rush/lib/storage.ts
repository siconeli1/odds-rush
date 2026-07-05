import AsyncStorage from '@react-native-async-storage/async-storage';

const BALANCE_KEY = '@odds-rush/balance';
const RECORD_KEY = '@odds-rush/record';

export async function loadBalance(fallback: number): Promise<number> {
  const stored = await AsyncStorage.getItem(BALANCE_KEY);
  return stored !== null ? Number(stored) : fallback;
}

export async function saveBalance(balance: number): Promise<void> {
  await AsyncStorage.setItem(BALANCE_KEY, String(balance));
}

export async function loadRecord(fallback: number): Promise<number> {
  const stored = await AsyncStorage.getItem(RECORD_KEY);
  return stored !== null ? Number(stored) : fallback;
}

export async function saveRecord(record: number): Promise<void> {
  await AsyncStorage.setItem(RECORD_KEY, String(record));
}
