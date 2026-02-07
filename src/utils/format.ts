import { format, formatDistanceToNow } from 'date-fns';

export const formatCurrency = (amount: number, currency: string = 'PLN'): string => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'dd MMM yyyy, HH:mm');
};

export const formatDateRelative = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};
