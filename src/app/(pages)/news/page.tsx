import News from '@/components/(pages)/news/News';
import Header from '@/components/shared/Header';
import React from 'react';

interface DataType {
    [key: string]: any;
}

const page = async () => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/data/data.json`, { cache: 'no-store' });
    const data: DataType = await res.json();

    return (
        <div>
            <Header>Latest News</Header>
            <News data={data}/>
        </div>
    );
};

export default page;
