import Home from '@/components/(pages)/home/Home';
import React from 'react';

interface DataType {
  [key: string]: any;
}

export default async function Page() {
  const res = await fetch('http://localhost:3000/data/data.json', { cache: 'no-store' });
  const data: DataType = await res.json();

  return (
    <div>
      <Home data={data} />
    </div>
  );
}
