-- CreateEnum
CREATE TYPE "GridLayout" AS ENUM ('FEATURED', 'MAGAZINE', 'STANDARD', 'VIDEO');

-- CreateEnum
CREATE TYPE "HomepageVisibility" AS ENUM ('PUBLIC', 'HIDDEN', 'SCHEDULED');

-- CreateIndex on news for homepage performance
CREATE INDEX IF NOT EXISTS "news_category_id_status_published_at_idx" ON "news"("category_id", "status", "published_at" DESC);

-- CreateTable
CREATE TABLE "homepage_grids" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "section_title" VARCHAR(200) NOT NULL,
    "display_order" INTEGER NOT NULL,
    "layout_type" "GridLayout" NOT NULL DEFAULT 'FEATURED',
    "article_limit" INTEGER NOT NULL DEFAULT 10,
    "featured_limit" INTEGER NOT NULL DEFAULT 1,
    "visibility" "HomepageVisibility" NOT NULL DEFAULT 'PUBLIC',
    "show_view_all" BOOLEAN NOT NULL DEFAULT true,
    "updated_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "homepage_grids_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "homepage_grids_category_id_key" ON "homepage_grids"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_grids_display_order_key" ON "homepage_grids"("display_order");

-- CreateIndex
CREATE INDEX "homepage_grids_display_order_idx" ON "homepage_grids"("display_order");

-- CreateIndex
CREATE INDEX "homepage_grids_visibility_display_order_idx" ON "homepage_grids"("visibility", "display_order");

-- AddForeignKey
ALTER TABLE "homepage_grids" ADD CONSTRAINT "homepage_grids_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_grids" ADD CONSTRAINT "homepage_grids_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
