import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const nowWIB = () => dayjs().tz('Asia/Jakarta').toDate();

export const toWIB = (date) => dayjs(date).tz('Asia/Jakarta').format();
