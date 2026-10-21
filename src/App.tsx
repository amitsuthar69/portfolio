import { Analytics } from '@vercel/analytics/react';
import Portfolio from './Portfolio';

export default function App() {
  return (
    <>
      <Analytics />
      <Portfolio />
    </>
  );
}
