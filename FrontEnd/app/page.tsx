"use client";
import {ChevronRight, GraduationCap} from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white">
                <div className="container mx-auto px-5 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <GraduationCap className="w-8 h-8"/>
                            <span className="font-bold text-2xl">EduSchedule</span>
                        </Link>
                        <Link
                            href="/auth"
                            className="flex justify-center items-center bg-white text-black font-bold p-2 w-[7.5rem] rounded-lg hover:cursor-pointer"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </header>
            <section className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white pb-16 pt-13">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-7 animate-fade-in">
                        Smart School Scheduling
                    </h1>
                    <p
                        className="text-xl md:text-2xl opacity-90 mb-10 max-w-2xl mx-auto animate-fade-in"
                        style={{animationDelay: "0.1s"}}
                    >
                        Effortlessly manage timetables, teachers, subjects, and classrooms
                        all in one place.
                    </p>
                    <div className="flex justify-center items-center">
                        <Link href="/auth"
                              className="bg-white font-bold text-black p-4 rounded-lg flex w-[11.5rem] items-center justify-center">
                            Get Started
                            <ChevronRight className="w-5 h-5 ml-[0.3em] "/>

                        </Link>
                    </div>
                </div>
            </section>
            <section className="container mx-auto px-4 py-16 text-black">
                <h2 className="text-3xl font-bold text-center mb-4">
                    Everything You Need
                </h2>
                <p className="text-muted-foreground text-center text-slate-600 mb-8 max-w-2xl mx-auto">
                    A complete suite of tools designed specifically for educational
                    institutions
                </p>
            </section>
        </div>
    );
}
