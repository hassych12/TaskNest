import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// 日付が有効かどうかをチェックする関数
const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

export function formatDate(date: Date | null | undefined): string {
  if (!date || !isValidDate(date)) {
    return '日付なし';
  }
  
  try {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('日付フォーマットエラー:', error);
    return '日付なし';
  }
}

export function formatDateTime(date: Date | null | undefined): string {
  if (!date || !isValidDate(date)) {
    return '日付なし';
  }
  
  try {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('日時フォーマットエラー:', error);
    return '日付なし';
  }
}

export function getRelativeTime(date: Date | null | undefined): string {
  if (!date || !isValidDate(date)) {
    return '日付なし';
  }
  
  try {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '今';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}時間前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}日前`;
    
    return formatDate(date);
  } catch (error) {
    console.error('相対時間計算エラー:', error);
    return '日付なし';
  }
}

export const COLORS = [
  { name: 'Slate', value: 'bg-slate-500' },
  { name: 'Gray', value: 'bg-gray-500' },
  { name: 'Zinc', value: 'bg-zinc-500' },
  { name: 'Neutral', value: 'bg-neutral-500' },
  { name: 'Stone', value: 'bg-stone-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Amber', value: 'bg-amber-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Lime', value: 'bg-lime-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Emerald', value: 'bg-emerald-500' },
  { name: 'Teal', value: 'bg-teal-500' },
  { name: 'Cyan', value: 'bg-cyan-500' },
  { name: 'Sky', value: 'bg-sky-500' },
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
  { name: 'Violet', value: 'bg-violet-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Fuchsia', value: 'bg-fuchsia-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Rose', value: 'bg-rose-500' },
]; 