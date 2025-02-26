import Contact from '@/components/(pages)/contact/Contact';
import React from 'react';

interface DataType {
    [key: string]: any;
}

const page = async () => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/data/data.json`, { cache: 'no-store' });
    const data: DataType = await res.json();

    return (
        <div>
            <Contact data={data}/>
        </div>
    );
};

export default page;