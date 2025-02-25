'use client'

import React from 'react';
import Image from 'next/image';
import { HoverWrapper } from '@/components/shared/motion-wrapper/HoverWrapper';

const Team = ({ data }: any) => {
    return (
        <>
            <div className=" flex flex-col gap-10 justify-center items-center">
                {data.teamData.map((category: any) => (
                    <div key={category.category} className="">
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                            {category.category}
                        </h2>
                        <div className="flex flex-wrap gap-6">
                            {category.members.map((member: any) => (
                                <HoverWrapper
                                    key={member.name}
                                    className="flex flex-col min-w-60 items-center text-center bg-white p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
                                >
                                    <Image
                                        src={member.image || ''}
                                        alt={member.name}
                                        width={128}
                                        height={128}
                                        className="rounded-full mb-4 border border-primary"
                                    />
                                    <p className="text-xl font-medium text-primary">{member.name}</p>
                                    <p className="text-gray-600">{member.university}</p>
                                    <p className="text-gray-500">{member.role}</p>
                                </HoverWrapper>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Team;
