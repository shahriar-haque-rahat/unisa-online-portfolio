import Home from '@/components/(pages)/home/Home';
import React from 'react';

interface DataType {
  [key: string]: any;
}

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/data/data.json`, { cache: 'no-store' });
  const data: DataType = await res.json();

  return (
    <div>
      <Home data={data} />
    </div>
  );
}
