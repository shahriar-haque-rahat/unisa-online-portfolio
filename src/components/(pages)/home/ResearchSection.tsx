'use client'

import React from "react";
import { SecondaryButton } from "@/components/shared/Button";


const ResearchSection = ({ data }: any) => {
    const handleDetails = (link: string) => {
        window.open(link, '_blank');
    };
    
    return (
        <div className=" grid grid-cols-1 lg:grid-cols-2 justify-center lg:justify-between gap-6">
            {data.researchData.slice(0, 2).map((research: any) => {
                const truncatedText = research.description.split(" ").slice(0, 20).join(" ") + "...";

                return (
                    <div key={research.id} className=" relative">
                        {/* Image Section */}
                        <img
                            src={research.imageSrc || ''}
                            alt={research.title}
                            className="md:w-[calc(100%-40px)] h-[400px] xl:h-[500px] md:m-10 object-cover object-center"
                        />

                        {/* Text Content Overlapping Image */}
                        <div className="absolute bottom-0 left-0 md:mr-[20%] xl:mr-[30%] flex flex-col justify-between bg-primary text-white p-4 shadow-md">
                            <span>
                                <h2 className="text-xl font-semibold">{research.title}</h2>
                                <p className="mt-2 text-sm">{truncatedText}</p>
                            </span>

                            {/* Details Button */}
                            <div className="flex justify-end">
                                <SecondaryButton onClick={() => handleDetails(research.link)}>
                                    Details
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ResearchSection;
