import ProductCard from "@/components/shared/products/Product";
import { Badge } from "@/components/ui/badge";
import { getAllCategories, getProducts } from "@/lib/actions/products.actions";
import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ""} 
      ${isCategorySet ? `: Category ${category}` : ""}
      ${isPriceSet ? `: Price ${price}` : ""}
      ${isRatingSet ? `: Rating ${rating}` : ""}`,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

const SearchPage: React.FC<{
  searchParams: Promise<{
    price: string;
    q: string;
    sort: string;
    page: number;
    limit: number;
    category: string;
    rating: string;
  }>;
}> = async ({ searchParams }) => {
  const {
    category = "all",
    limit,
    page,
    q = "all",
    sort = "newest",
    price = "all",
    rating = "all",
  } = await searchParams;
  const products = await getProducts({
    category,
    limit,
    page,
    query: q,
    sort,
    price,
    rating,
  });

  const prices = [
    {
      name: "Any",
      value: "all",
    },
    {
      name: "1 to 50",
      value: "1-50",
    },
    {
      name: "51 to 100",
      value: "51-100",
    },
    {
      name: "101 to 200",
      value: "101-200",
    },
    {
      name: "201 to 500",
      value: "201-500",
    },
    {
      name: "501 to 1000",
      value: "501-1000",
    },
  ];

  const ratings = [
    {
      name: "Any",
      value: "all",
    },
    {
      name: "1 and up",
      value: "1",
    },
    {
      name: "2 and up",
      value: "2",
    },
    {
      name: "3 and up",
      value: "3",
    },
    {
      name: "4 and up",
      value: "4",
    },
  ];

  const { data: categories } = await getAllCategories();

  const constructURLFilters = ({
    c,
    s,
    r,
    query,
    p,
  }: Record<string, string>) => {
    const params = { q, sort, rating, price, category };
    if (c) params.category = c;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (query) params.q = query;
    if (p) params.price = p;
    const searchParams = new URLSearchParams(params).toString();
    return `/search?${searchParams}`;
  };
  return (
    <section className="grid sm:grid-cols-2 md:grid-cols-5 gap-4 items-start">
      <aside className="col-span-1 flex flex-col gap-6">
        <header className="h2-bold">Filters</header>
        <main className="flex flex-col gap-4">
          <article className="flex flex-col gap-2">
            <header className="h3-bold">Category</header>
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  className={category === "all" ? "font-bold" : ""}
                  href={constructURLFilters({ c: "all" })}
                >
                  Any
                </Link>
              </li>
              {categories?.map((c) => (
                <li key={c.category}>
                  <Link
                    href={constructURLFilters({ c: c.category })}
                    className={c.category === category ? "font-bold" : ""}
                  >
                    {c.category}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
          <article className="flex flex-col gap-2">
            <header className="h3-bold">Price</header>
            <ul className="flex flex-col gap-1">
              {prices?.map((p) => (
                <li key={p.name}>
                  <Link
                    href={constructURLFilters({ p: p.value })}
                    className={p.value === price ? "font-bold" : ""}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
          <article className="flex flex-col gap-2">
            <header className="h3-bold">Customer Ratings</header>
            <ul className="flex flex-col gap-1">
              {ratings?.map((r) => (
                <li key={r.name}>
                  <Link
                    href={constructURLFilters({ r: r.value })}
                    className={r.value === rating ? "font-bold" : ""}
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </main>
      </aside>
      <div className="md:col-span-4 col-span-1 flex flex-col gap-4">
        <div className="flex flex-col justify-between items-center gap-4 md:flex-row">
          <div className="flex gap-3 flex-wrap">
            {q !== "all" && (
              <Link
                href={constructURLFilters({ query: "all" })}
                aria-label={`Remove query filter: ${q}`}
              >
                <Badge className="flex items-center gap-3 cursor-pointer">
                  query: {q} <X size={14} />
                </Badge>
              </Link>
            )}
            {category !== "all" && (
              <Link
                href={constructURLFilters({ c: "all" })}
                aria-label={`Remove category filter: ${category}`}
              >
                <Badge className="flex items-center gap-3 cursor-pointer">
                  category: {category} <X size={14} />
                </Badge>
              </Link>
            )}
            {price !== "all" && (
              <Link
                href={constructURLFilters({ p: "all" })}
                aria-label={`Remove price filter: ${price}`}
              >
                <Badge className="flex items-center gap-3 cursor-pointer">
                  price: {price} <X size={14} />
                </Badge>
              </Link>
            )}
            {rating !== "all" && (
              <Link
                href={constructURLFilters({ r: "all" })}
                aria-label={`Remove rating filter: ${rating} and up`}
              >
                <Badge className="flex items-center gap-3 cursor-pointer">
                  rating: {rating} and up <X size={14} />
                </Badge>
              </Link>
            )}
          </div>
          <div className="flex gap-6">
            <h3 className="font-bold">Sort By: </h3>
            <ul className="flex gap-3">
              {["newest", "lowest", "highest", "rating"].map((s) => (
                <li key={s}>
                  <Link
                    href={constructURLFilters({ s })}
                    className={s === sort ? "font-bold" : ""}
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {products.data?.products.length === 0 && <h2>No products found</h2>}
          {products.data?.products.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SearchPage;
