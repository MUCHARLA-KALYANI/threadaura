import ProductItem from "@/components/products/ProductItem";
import productService from "@/lib/services/ProductService";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Next Amazona V2",
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    "Nextjs, Server components, Next auth, daisyui, zustand",
};

export default async function Home() {
  const featuredProducts = await productService.getFeatured();
  const latestProducts = await productService.getLatest();

  // Filter and deduplicate featured products
  const uniqueFeaturedProducts = featuredProducts
    .filter(product => product.banner && product.banner.trim() !== '')
    .filter((product, index, self) =>
      index === self.findIndex(p => p.banner === product.banner)
    );

  return (
    <>
      {uniqueFeaturedProducts.length > 0 && (
        <div className="w-full carousel rounded-box mt-4">
          {uniqueFeaturedProducts.map((product, index) => (
            <div
              key={product.slug}
              id={`slide-${index}`}
              className="carousel-item relative w-full h-[400px]"
            >
              <Link href={`/product/${product.slug}`} className="w-full h-full">
                <Image
                  src={product.banner!}
                  alt={product.name}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover rounded-box"
                />
              </Link>
              <div className="absolute flex justify-between items-center left-5 right-5 top-1/2 transform -translate-y-1/2 z-10">
                <a
                  href={`#slide-${
                    index === 0 ? uniqueFeaturedProducts.length - 1 : index - 1
                  }`}
                  className="btn btn-circle"
                >
                  ❮
                </a>
                <a
                  href={`#slide-${
                    index === uniqueFeaturedProducts.length - 1 ? 0 : index + 1
                  }`}
                  className="btn btn-circle"
                >
                  ❯
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl py-2">Latest Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {latestProducts.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
    </>
  );
}