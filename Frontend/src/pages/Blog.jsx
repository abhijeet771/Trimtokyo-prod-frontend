import React from "react";
import HeaderSection from "../sections/HeaderSection/HeaderSection";
import BlogListSection from "../sections/BlogListSection/BlogListSection";
import BlogDetailSection from "../sections/BlogDetailSection/BlogDetailSection";
import MainFooterSection from "../sections/MainFooterSection/MainFooterSection";


const Blog = () => {
  return (
    <>
      <HeaderSection />
      <BlogListSection/>
      <BlogDetailSection/>
      <MainFooterSection/>  
    </>
  );
};

export default Blog;