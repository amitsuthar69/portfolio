"use client";
import Title from "../../../components/resume/Title";
import data from "../../../content/resume.json";
import Education from "../../../components/resume/Education";
import Experience from "../../../components/resume/Experience";
import Projects from "../../../components/resume/Projects";
import Skills from "../../../components/resume/Skills";

import { NextPage } from "next";
import { useRouter } from "next/navigation";

const page: NextPage = () => {
  const router = useRouter();
  return (
    <div className="pt-5 pb-10 dark:bg-theme-900">
      <button onClick={() => router.back()}>go back</button>
      <Title titleInfo={data.title} />
      <Education eduInfo={data.education} />
      <Experience expInfo={data.experience} />
      <Projects projectInfo={data.projects} />
      <Skills skills={data.skills} />
    </div>
  );
};

export default page;
