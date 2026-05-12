// Revalidate homepage every 60 seconds so DB-driven sections (tours, testimonials) stay fresh
export const revalidate = 60;

import { AboutSection } from "@/components/AboutSection";
import { BlogSection } from "@/components/BlogSection";
import { CTASection } from "@/components/CTASection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { FeaturedToursSection } from "@/components/FeaturedToursSection";
import { Footer } from "@/components/Footer";
import { GuestTestimonialsSection } from "@/components/GuestTestimonialsSection";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { VideoSection } from "@/components/VideoSection";
import { db } from "@/db";
import { blogPosts as blogPostsTable, testimonials as testimonialsTable, user as userTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function Home() {
  const approvedTestimonials = await db
    .select({
      guestName: testimonialsTable.guestName,
      country: testimonialsTable.country,
      rating: testimonialsTable.rating,
      text: testimonialsTable.text,
      photoUrl: testimonialsTable.photoUrl,
    })
    .from(testimonialsTable)
    .where(eq(testimonialsTable.approved, true))
    .orderBy(testimonialsTable.createdAt);

  // Normalize: null photoUrl → fallback avatar
  const testimonials = approvedTestimonials.map((t) => ({
    guestName: t.guestName,
    country: t.country ?? "",
    rating: t.rating,
    text: t.text,
    photoUrl: t.photoUrl ?? "/images/roshan-avatar.png",
  }));

  const latestBlogPosts = await db
    .select({
      slug: blogPostsTable.slug,
      title: blogPostsTable.title,
      excerpt: blogPostsTable.excerpt,
      coverImage: blogPostsTable.coverImage,
      createdAt: blogPostsTable.createdAt,
      authorName: userTable.name,
    })
    .from(blogPostsTable)
    .leftJoin(userTable, eq(blogPostsTable.authorId, userTable.id))
    .where(eq(blogPostsTable.published, true))
    .orderBy(desc(blogPostsTable.createdAt))
    .limit(3);

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />
      <HeroSection />
      <VideoSection />
      <FeaturedToursSection />
      <DestinationsSection />
      <AboutSection />
      <GuestTestimonialsSection testimonials={testimonials} />
      <BlogSection posts={latestBlogPosts} />
      <CTASection />
      <Footer />
    </main>
  );
}
