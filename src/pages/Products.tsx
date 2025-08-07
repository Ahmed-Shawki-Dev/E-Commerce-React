import { Box, Grid } from "@chakra-ui/react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks";
import type { IProduct } from "../interfaces";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import { trimText } from "@/utils";

const ProductsPage = () => {
  const { data: products, isLoading } = useProducts();
  if (isLoading) return <SkeletonLoader />;

  return (
    <Box>
      <Grid
        templateColumns={"repeat(auto-fill,minmax(300px,1fr))"}
        gap={6}
        m={30}
      >
        {products.data.map((product: IProduct) => (
          <ProductCard
            thumbnail={
              product.thumbnail ?? {
                url: "/default-user-icon-person-avatar.jpg",
              }
            }
            title={product.title}
            description={trimText(product.description)}
            price={product.price}
            key={product.documentId}
            documentId={product.documentId}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsPage;
