import React from 'react';
import {StepCardProps} from "@/components/cards/interfaces/StepCardInterfaces";


const StepCard = ({ step, title, description, gradientClass }: StepCardProps) => (
    <div className="text-center">
        <div className={`w-16 h-16 ${gradientClass} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold`}>
            {step}
        </div>
        <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

export default StepCard;
