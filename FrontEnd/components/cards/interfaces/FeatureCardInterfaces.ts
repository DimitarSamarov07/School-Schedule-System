import React from "react";
import {LucideProps} from "lucide-react";

export interface FeatureCardProps {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    title: string;
    description: string;
}