import React from 'react';
import {FeatureCardProps} from "@/components/cards/interfaces/FeatureCardInterfaces";

const FeatureCard = ({ icon: Icon, title, description } : FeatureCardProps) => (
    <div className="bg-white border-0 rounded-lg shadow-lg p-6 text-center hover:scale-105 transition-all duration-300">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default FeatureCard;
