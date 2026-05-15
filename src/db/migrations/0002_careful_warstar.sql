CREATE TABLE "map_usage_logs" (
	"date" date PRIMARY KEY NOT NULL,
	"page_views" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
