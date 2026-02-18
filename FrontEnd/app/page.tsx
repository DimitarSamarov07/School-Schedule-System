"use client";

import Link from 'next/link';
import {ChevronRight,} from 'lucide-react';
import FeatureCard from "@/components/cards/FeatureCard";
import {features} from "@/config/featuresConfig";
import WhyCard from "@/components/cards/WhyCard";
import {whyItems} from "@/config/whyChooseUsConfig";
import StepCard from "@/components/cards/StepCard";
import {steps} from "@/config/stepsConfig";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header></Header>
            {/* Hero Section */}
            <section className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white pb-16 pt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                        График за всички ваши разписания
                    </h1>
                    <p
                        className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto animate-fade-in"
                        style={{animationDelay: '0.1s'}}
                    >
                        Лесно управлявайте часови разписания, учители, предмети и зали в едно място.
                    </p>
                    <Link href="/auth">
                        <button
                            className="bg-indigo-600 text-white font-semibold text-lg px-8 py-3 rounded-md hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer">
                            Започни сега
                            <ChevronRight className="w-5 h-5 ml-2 inline"/>
                        </button>
                    </Link>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
                    Всичко, което ви е нужно
                </h2>
                <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    Пълен набор от инструменти, специално създадени за образователни институции
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </section>

            <section className="bg-gray-50/50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
                        Защо училищата избират EduSchedule
                    </h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Създадено от педагози, за педагози. Разбираме уникалните предизвикателства на училищното
                        управление.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {whyItems.map((item, index) => (
                            <WhyCard key={index} {...item} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
                    Как работи
                </h2>
                <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    Стартирайте училищния си график за три прости стъпки
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {steps.map((stepData, index) => (
                        <StepCard key={index} {...stepData} />
                    ))}
                </div>
            </section>

            <section className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Готови ли сте да опростите училището си?
                    </h2>
                    <p className="text-lg mb-8 max-w-xl mx-auto opacity-90">
                        Присъединете се към училища по целия свят, които използват EduSchedule за опростяване на
                        графиците си.
                    </p>
                    <Link href="/auth">
                        <button
                            className="bg-white text-indigo-600 font-semibold text-lg px-8 py-3 rounded-md hover:scale-105 transition-all duration-200 shadow-lg">
                            Започни сега
                            <ChevronRight className="w-5 h-5 ml-2 inline"/>
                        </button>
                    </Link>
                </div>
            </section>

            <Footer></Footer>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;
