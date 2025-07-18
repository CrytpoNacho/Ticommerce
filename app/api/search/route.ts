import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Implementación simple de rate limiting
const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 30;
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

setInterval(() => {
  const now = Date.now();
  ipRequestCounts.forEach((data, ip) => {
    if (now > data.resetTime) ipRequestCounts.delete(ip);
  });
}, RATE_LIMIT_WINDOW);

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    let ipData = ipRequestCounts.get(ip);
    if (!ipData || now > ipData.resetTime) {
      ipData = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
      ipRequestCounts.set(ip, ipData);
    }

    ipData.count++;
    if (ipData.count > RATE_LIMIT_MAX) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "relevance";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const isRecommended = searchParams.get("recommended") === "true";

    const filters: any = { is_active: true };

    if (!isRecommended) {
      if (query.trim()) {
        filters.OR = [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ];
      }

      if (category && category !== "all") {
        const categories = category
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);

        if (categories.length === 1) {
          filters.category = { contains: categories[0], mode: "insensitive" };
        } else if (categories.length > 1) {
          filters.OR = [
            ...(filters.OR || []),
            ...categories.map((c) => ({
              category: { contains: c, mode: "insensitive" },
            })),
          ];
        }
      }

      if (minPrice) {
        filters.price = { ...(filters.price || {}), gte: parseFloat(minPrice) };
      }

      if (maxPrice) {
        filters.price = { ...(filters.price || {}), lte: parseFloat(maxPrice) };
      }
    }

    const orderBy: any[] = [];
    switch (sortBy) {
      case "price_asc":
        orderBy.push({ price: "asc" });
        break;
      case "price_desc":
        orderBy.push({ price: "desc" });
        break;
      case "newest":
        orderBy.push({ created_at: "desc" });
        break;
      case "oldest":
        orderBy.push({ created_at: "asc" });
        break;
      case "name_asc":
        orderBy.push({ name: "asc" });
        break;
      case "name_desc":
        orderBy.push({ name: "desc" });
        break;
      case "stock":
        orderBy.push({ stock_quantity: "desc" });
        break;
      default:
        if (query && !isRecommended) {
          orderBy.push({ name: "asc" });
        } else {
          orderBy.push({ created_at: "desc" });
        }
    }

    const products = await prisma.products.findMany({
      where: filters,
      include: {
        sellers: {
          include: {
            users: {
              select: { name: true },
            },
          },
        },
        brands: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        product_media: {
          orderBy: {
            display_order: "asc",
          },
        },
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.products.count({ where: filters });

    const productsWithImages = products.map((product) => {
    let image = null;

    if (Array.isArray(product.product_media) && product.product_media.length > 0) {
      const primary = product.product_media.find((img) => img.is_primary === true);
      image = primary?.file_url || product.product_media[0].file_url;
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      category: product.category,
      seller_id: product.seller_id,
      is_active: product.is_active,
      is_promoted: product.is_promoted,
      stock_quantity: product.stock_quantity,
      created_at: product.created_at?.toISOString?.() ?? null,
      brands: product.brands,
      sellers: product.sellers,
      product_media: product.product_media,
      primary_image: image || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name || "product")}`,
    };
  });

  return NextResponse.json({
    products: productsWithImages,
    total: totalCount,
    hasMore: totalCount > offset + limit,
  })

  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
