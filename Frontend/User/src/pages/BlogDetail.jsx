import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CalendarDays, User, Tag } from "lucide-react";

const fallbackBlogImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/posts/${slug}`);
        setPost(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Post not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50">
        <div className="animate-pulse">
          <div className="h-80 bg-muted w-full" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="h-8 bg-muted rounded w-2/3 mb-4" />
            <div className="h-4 bg-muted rounded w-1/3 mb-8" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-muted rounded" style={{ width: `${90 - i * 5}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">{error || "Post not found"}</p>
          <Button asChild variant="outline">
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {post.coverImage && (
        <div className="relative h-64 sm:h-80 md:h-96">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm">
              <Link to="/blog">
                <ArrowLeft className="size-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {!post.coverImage && (
          <Button asChild variant="ghost" className="mb-4 -ml-2">
            <Link to="/blog">
              <ArrowLeft className="size-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User className="size-4" />
              {post.author}
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg text-muted-foreground italic mb-6">
            {post.excerpt}
          </p>
        )}

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                <Tag className="size-3 mr-1" />{tag}
              </Badge>
            ))}
          </div>
        )}

        <div
          className="prose prose-lg max-w-none text-foreground prose-headings:font-heading prose-headings:text-foreground prose-a:text-primary prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />
      </article>
    </div>
  );
};

export default BlogDetail;
