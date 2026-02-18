import React from 'react';
import {WhyCardProps} from "@/components/cards/interfaces/WhyCardInterfaces";

const WhyCard = ({ icon: Icon, title, description } : WhyCardProps) => (
    <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    </div>
);

export default WhyCard;
