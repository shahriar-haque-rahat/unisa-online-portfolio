import React from 'react';
import Image from 'next/image';
import { HoverWrapper } from '@/components/shared/motion-wrapper/HoverWrapper';

// Define the team data
const teamData = [
    {
        category: "Primary Investigator",
        members: [
            {
                name: "Afsaneh Doryab",
                university: "University of Virginia",
                role: "Principal Investigator",
                image: "/path/to/afsaneh.jpg",
            },
        ],
    },
    {
        category: "PhD Students",
        members: [
            {
                name: "Maria Cardei",
                university: "University of Virginia",
                role: "PhD Student",
                image: "/path/to/maria.jpg",
            },
            {
                name: "Matt Clark",
                university: "University of Virginia",
                role: "PhD Student",
                image: "/path/to/matt_clark.jpg",
            },
            {
                name: "Matt Landers",
                university: "University of Virginia",
                role: "PhD Student",
                image: "/path/to/matt_landers.jpg",
            },
        ],
    },
    {
        category: "Master's Students",
        members: [
            {
                name: "Ji Hyun Kim",
                university: "University of Virginia",
                role: "Masters Student",
                image: "/path/to/ji_hyun_kim.jpg",
            },
        ],
    },
    {
        category: "Undergraduate Students",
        members: [
            {
                name: "Andrew Balch",
                university: "University of Virginia",
                role: "Undergraduate Student",
                image: "/path/to/andrew_balch.jpg",
            },
            {
                name: "Armaan Chakrabarti",
                university: "University of Virginia",
                role: "Undergraduate Student",
                image: "/path/to/armaan_chakrabarti.jpg",
            },
            {
                name: "Chong Zhao",
                university: "Grinnell College",
                role: "Undergraduate Student",
                image: "/path/to/chong_zhao.jpg",
            },
        ],
    },
];

const Team = () => {
    return (
        <div className=" flex flex-col gap-10 justify-center items-center">
            {teamData.map((category) => (
                <div key={category.category} className="">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                        {category.category}
                    </h2>
                    <div className="flex flex-wrap gap-6">
                        {category.members.map((member) => (
                            <HoverWrapper
                                key={member.name}
                                className="flex flex-col min-w-60 items-center text-center bg-white p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
                            >
                                <Image
                                    src={member.image}
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
    );
};

export default Team;
