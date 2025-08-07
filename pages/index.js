import { useEffect, useState } from 'react';

export default function Home() {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const target = new Date('2025-08-10T18:00:00Z');
    const timer = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        setCountdown('00:00:00');
        clearInterval(timer);
      } else {
        const hours = String(Math.floor((diff /...
