import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";

const FeedBackList = ({ feedBacks }) => {
  return (
    <div className="space-y-4">
      {feedBacks.map((fb) => (
        <Card key={fb._id || fb.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{fb.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {fb.country && <span>{fb.country}</span>}
                    {fb.email && <span className="text-muted-foreground/50">|</span>}
                    {fb.email && <span>{fb.email}</span>}
                  </div>
                </div>
              </div>
              {fb.rating && (
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < fb.rating
                          ? "fill-terracotta-500 text-terracotta-500"
                          : "text-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="text-foreground leading-relaxed">{fb.feedBackText}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedBackList;
