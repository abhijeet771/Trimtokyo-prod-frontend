import React from "react";
import HeaderSection from "../sections/HeaderSection/HeaderSection";
import BlogListSection from "../sections/BlogListSection/BlogListSection";
import BlogDetailSection from "../sections/BlogDetailSection/BlogDetailSection";
import MainFooter from "../components/organisms/MainFooter/MainFooter";
const Blog = () => {
  return (
    <>
      <HeaderSection />
      <BlogListSection/>
      <BlogDetailSection/>
      <MainFooter/>  
    </>
  );
};

export default Blog;