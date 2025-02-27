"use client";

import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

type Tag = {
  id: string;
  name: string;
  count: number;
};

export default function TagCloud() {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        // Fetch tags from the API
        const response = await fetch("/api/tags");

        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }

        const data = await response.json();
        setTags(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag: string) => {
    router.push(`/${locale}/search?tag=${tag}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Function to determine font size based on count
  const getFontSize = (count: number) => {
    const min = Math.min(...tags.map((tag) => tag.count));
    const max = Math.max(...tags.map((tag) => tag.count));
    const range = max - min;
    const normalizedSize = range === 0 ? 1 : (count - min) / range;
    return 0.8 + normalizedSize * 1.2; // Font sizes between 0.8rem and 2rem
  };

  return (
    <Card>
      <Card.Header>
        <h2 className="h5 mb-0">{t("popularTags")}</h2>
      </Card.Header>
      <Card.Body className="tag-cloud">
        {tags.length === 0 ? (
          <p className="text-center text-muted">{t("noTagsYet")}</p>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="tag"
                style={{ fontSize: `${getFontSize(tag.count)}rem` }}
                onClick={() => handleTagClick(tag.name)}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
