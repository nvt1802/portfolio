"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const Portifolio = () => {
    return <>
        {/* Hero Section */}
        <section className="text-center">
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Image src="/avatar.jpg" alt="Avatar" width={120} height={120} className="rounded-full shadow-lg" />
                <h1 className="text-4xl font-bold mt-4">Hi, I'm Your Name</h1>
                <p className="text-lg text-gray-500">Front-End Developer | Passionate about UI/UX</p>
                <div className="mt-6 flex gap-4 justify-center">
                    <Button>Hire Me</Button>
                    <Button variant="outline">Download CV</Button>
                </div>
            </motion.div>
        </section>

        {/* About Section */}
        <section className="max-w-2xl text-center">
            <h2 className="text-3xl font-bold">About Me</h2>
            <p className="mt-4 text-gray-600">I am a passionate front-end developer specializing in Next.js, TypeScript, and Tailwind CSS.</p>
        </section>

        {/* Skills Section */}
        <section className="text-center">
            <h2 className="text-3xl font-bold">Skills</h2>
            <div className="mt-6 flex gap-4 flex-wrap justify-center">
                {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'].map(skill => (
                    <span key={skill} className="px-4 py-2 bg-gray-200 rounded-lg">{skill}</span>
                ))}
            </div>
        </section>

        {/* Projects Section */}
        <section className="text-center">
            <h2 className="text-3xl font-bold">Projects</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(project => (
                    <Card key={project} className="p-4">
                        <CardContent>
                            <h3 className="text-xl font-semibold">Project {project}</h3>
                            <p className="text-gray-600">Description of project {project}.</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
            <h2 className="text-3xl font-bold">Contact Me</h2>
            <p className="mt-4 text-gray-600">Email: your.email@example.com</p>
            <p>LinkedIn | GitHub | Twitter</p>
        </section>

        {/* Footer */}
        <footer className="text-gray-500 text-sm text-center py-4">© 2024 Your Name. All rights reserved.</footer>
    </>
}

export default Portifolio;