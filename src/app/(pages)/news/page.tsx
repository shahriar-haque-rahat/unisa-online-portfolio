import News from '@/components/(pages)/news/News';
import Header from '@/components/shared/Header';
import React from 'react';

const page = () => {
    return (
        <div>
            <Header>Latest News</Header>
            <News/>
        </div>
    );
};

export default page;