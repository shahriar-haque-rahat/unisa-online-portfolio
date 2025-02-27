import Research from '@/components/(pages)/research/Research';
import Header from '@/components/shared/Header';
import React from 'react';

interface DataType {
    [key: string]: any;
}

const page = async () => {
    const res = await fetch(`${process.env.NEXT_BASE_URL}/data/data.json`, { cache: 'no-store' });
    const data: DataType = await res.json();

    return (
        <div>
            <Header>Research</Header>
            <Research data={data}/>
        </div>
    );
};

export default page;