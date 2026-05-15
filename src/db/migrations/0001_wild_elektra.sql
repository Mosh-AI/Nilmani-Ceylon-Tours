CREATE TABLE "route_stops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route_id" uuid NOT NULL,
	"location_slug" text NOT NULL,
	"stop_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "photo_url" text;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "persons_included" integer DEFAULT 2;--> statement-breakpoint
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "route_stops_route_location_idx" ON "route_stops" USING btree ("route_id","location_slug");--> statement-breakpoint
CREATE INDEX "route_stops_route_id_idx" ON "route_stops" USING btree ("route_id");--> statement-breakpoint
CREATE INDEX "routes_created_at_idx" ON "routes" USING btree ("created_at");