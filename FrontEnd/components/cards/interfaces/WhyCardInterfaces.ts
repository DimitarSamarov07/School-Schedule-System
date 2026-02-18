import React from "react";
import {LucideProps} from "lucide-react";

export interface WhyCardProps {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    title: string;
    description: string;
}