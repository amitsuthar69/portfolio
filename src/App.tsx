import SystemApp from './ui/SystemApp';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <Analytics />
      <SystemApp />
    </>
  );
}