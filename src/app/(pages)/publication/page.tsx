import Publication from '@/components/(pages)/publication/Publication';
import Header from '@/components/shared/Header';
import React from 'react';

interface DataType {
    [key: string]: any;
}

const page = async () => {
    const res = await fetch('http://localhost:3000/data/data.json', { cache: 'no-store' });
    const data: DataType = await res.json();

    return (
        <div>
            <Header>Publication</Header>
            <Publication data={data}/>
        </div>
    );
};

export default page;