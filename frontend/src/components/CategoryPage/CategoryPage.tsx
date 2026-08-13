"use client";

import { useEffect, useState, useCallback } from "react";
import { getCategoryFeedAPI } from "@/lib/newsApi";
import type { CategoryFeedResponse, MainSiteNewsItem } from "@/lib/newsApi";
import { LoadMoreButton } from "./LoadMoreButton";
import { Skeleton } from "./Skeleton";
import { MultiColumnGrid } from "./MultiColumnGrid";
import { CardListHybrid } from "./CardListHybrid";
import { PhotoGrid } from "./PhotoGrid";

export function CategoryPage({ slug }: { slug: string }) {
  const [data, setData] = useState<CategoryFeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getCategoryFeedAPI(slug)
      .then(res => {
        if (!isMounted) return;
        if (res) {
          setData(res);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [slug]);

  const loadMore = useCallback(async () => {
    if (!data || !data.pagination.hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await getCategoryFeedAPI(slug, data.pagination.cursor || undefined);
      if (res) {
        setData(prev => {
          if (!prev) return res;
          return {
            ...prev,
            older: [...prev.older, ...res.older],
            pagination: res.pagination
          };
        });
      }
    } catch (e) {
      console.error("Failed to load more:", e);
    } finally {
      setLoadingMore(false);
    }
  }, [slug, data, loadingMore]);

  if (loading) return <Skeleton />;
  if (error || !data) return <div className="min-h-screen flex items-center justify-center text-zinc-400"><p>Category not found or no news published yet.</p></div>;

  const isGallery = slug === "photo-gallery" || data.category.slug === "photo-gallery";
  const allStories = [...data.hero, ...data.secondary, ...data.sidebar, ...data.older];
  const topStories = [...data.hero, ...data.secondary, ...data.sidebar];
  const feedStories = [...data.older];

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="border-b-4 border-zinc-900 mb-10 pb-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            {data.category.name}
          </h1>
        </div>
        
        {isGallery ? (
          <PhotoGrid items={allStories} />
        ) : (
          <>
            <MultiColumnGrid items={topStories} />
            {feedStories.length > 0 && (
              <div className="mt-16 pt-10 border-t border-zinc-200">
                <h2 className="text-2xl font-black uppercase mb-8">Latest Updates</h2>
                <CardListHybrid items={feedStories} />
              </div>
            )}
          </>
        )}
        
        <LoadMoreButton 
          onClick={loadMore} 
          loading={loadingMore} 
          hasMore={data.pagination.hasMore} 
        />
      </main>
    </div>
  );
}
