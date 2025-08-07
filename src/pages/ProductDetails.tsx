import { addToCartAction } from "@/app/features/cartSlice";
import { BASE_URL } from "@/config/index.config";
import { useGetProductDetails } from "@/hooks";
import { trimText } from "@/utils";
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  Heading,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
export default function ProductPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const [seeMore, setSeeMore] = useState(false);
  const { data: product } = useGetProductDetails(documentId ? documentId : "");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!product) return null;

  const { title, description, thumbnail, price } = product.data;

  const toggleSeeMore = () => setSeeMore((prev) => !prev);
  const goBack = () => navigate(-1);

  return (
    <>
      <Container maxW="7xl">
        <Box p={6} rounded="xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10} py={10}>
            <Flex direction="column" gap={4}>
              <Button
                onClick={goBack}
                leftIcon={<ArrowLeft />}
                variant="ghost"
                colorScheme="gray"
                alignSelf="start"
              >
                Back
              </Button>

              <Image
                rounded="lg"
                alt="product image"
                src={product && `${BASE_URL}${product.data.thumbnail?.url}`}
                fit="cover"
                w="full"
                h={{ base: "300px", md: "400px", lg: "500px" }}
                objectFit="cover"
                border="1px solid #eee"
              />
            </Flex>

            <Stack spacing={6} mt={{ lg: 50 }}>
              <Box>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  {product?.data.title}
                </Heading>
                <Text fontSize="2xl" fontWeight="semibold" color="green.500">
                  ${product?.data.price}
                </Text>
              </Box>

              <Box fontSize="lg" color="gray.600">
                <Text>
                  {seeMore
                    ? product?.data.description
                    : trimText(product?.data.description ?? "")}
                </Text>
                <Text
                  mt={2}
                  cursor="pointer"
                  onClick={toggleSeeMore}
                  color="blue.600"
                  fontWeight="medium"
                  textDecoration="underline"
                >
                  {seeMore ? "See less" : "See more"}
                </Text>
              </Box>

              <Button
                colorScheme="teal"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    addToCartAction({
                      documentId,
                      title,
                      description,
                      thumbnail,
                      price,
                      qty: 1,
                    }),
                  );
                }}
              >
                Add To Cart
              </Button>
            </Stack>
          </SimpleGrid>
        </Box>
      </Container>
    </>
  );
}
