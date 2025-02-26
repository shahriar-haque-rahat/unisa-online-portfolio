'use client'

import React from 'react';
import CountUp from 'react-countup';

const CounterSection = ({ data }: any) => {
    return (
        <section className="bg-primary text-white py-10 shadow-md">
            <div className="container mx-auto px-4">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold mb-2">Achievements</h2>
                    <p className="text-xl">Our journey at a glance</p>
                </div>

                {/* Counters Grid */}
                <div className="text-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                    {data.countersData.map((counter: any) => (
                        <div
                            key={counter.id}
                            className="flex flex-col items-center justify-center bg-white bg-opacity-10 p-4 rounded-lg"
                        >
                            <h3 className="text-2xl font-semibold">
                                <CountUp end={counter.value} duration={2} />+
                            </h3>
                            <p className="mt-2 text-sm">{counter.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CounterSection;
