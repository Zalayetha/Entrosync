import { Card, CardContent } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import { Star } from "lucide-react";
import type { FeedbackItem } from "../types";
import { formatProjectDate } from "../utils";

const starSlots = ["star-1", "star-2", "star-3", "star-4", "star-5"];

interface FeedbackCardProps {
  feedback: FeedbackItem;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const { i18n } = useTranslation();
  const rating = feedback.rating || 0;

  return (
    <Card className="p-0">
      <CardContent className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h3 className="font-semibold text-foreground">{feedback.title}</h3>
            <p className="text-xs font-medium text-muted-foreground">
              {formatProjectDate(feedback.createdAt, i18n.language === "id" ? "id-ID" : "en-US")}
            </p>
          </div>
          {rating > 0 ? (
            <div className="flex items-center gap-0.5 text-amber-500">
              {starSlots.map((slot, index) => (
                <Star
                  key={slot}
                  className={index < rating ? "size-4 fill-current" : "size-4 text-muted"}
                />
              ))}
            </div>
          ) : null}
        </div>
        {feedback.description ? (
          <p className="text-sm leading-6 text-muted-foreground">{feedback.description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
