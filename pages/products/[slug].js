import { createClient } from "contentful";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Skeleton from "./Skeleton";
import { fadeUp } from "../../animations/fadeUp";
import { useEffect } from "react";
import Link from "next/link";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  const res = await client.getEntries({
    content_type: "product",
  });
  const paths = res.items.map((item) => {
    return {
      params: { slug: item.fields.slug },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export async function getStaticProps({ params }) {
  const { items } = await client.getEntries({
    content_type: "product",
    "fields.slug": params.slug,
  });
  if (!items.length) {
    return {
      redirect: {
        destination: "/products",
        permenant: false,
      },
    };
  }
  return {
    props: {
      product: items[0],
    },
    revalidate: 1,
  };
}

const ProductDetails = ({ product }) => {
  useEffect(() => {
    fadeUp("#text");
  });

  if (!product) return <Skeleton />;

  const { productTitle, productImages, productDescription } = product.fields;
  return (
    <div className="mt-5 m-1">
      <div className="m-5 pt-5">
        <h2 className="text-center mt-5 text-blue-800">{productTitle}</h2>
      </div>{" "}
      <div className="m-0 m-lg-5 p-0 row justify-content-center">
        <div className="col-10 col-md-6 p-0 p-md-3">
          {" "}
          <Image
            src={"https:" + productImages[0].fields.file.url}
            width={productImages[0].fields.file.details.image.width}
            height={productImages[0].fields.file.details.image.height}
          />
        </div>
        <div id="text" className="col-10 col-md-6 p-0 p-md-3 mt-4 mt-md-0">
          {documentToReactComponents(productDescription)}
        </div>
      </div>
      <div className="d-flex justify-content-end me-5 my-5">
        <Link href="/products">
          <button className="btn btn-orange fw-bold">
            <i className="fas fa-undo"></i> Back to Products
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;
