import { BASE_URL } from "@/config/index.config";
import type { IProduct } from "@/interfaces";
import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Text,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCartAction } from "@/app/features/cartSlice";

export default function ProductCard({
  title,
  price,
  thumbnail,
  documentId,
  description,
  isNew = false,
}: IProduct & { isNew?: boolean }) {
  const dispatch = useDispatch();
  return (
    <Flex p={4} w="full" alignItems="center" justifyContent="center">
      <Box
        w="300px"
        h="460px"
        bg={useColorModeValue("white", "gray.800")}
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        overflow="hidden"
      >
        <Link to={`/products/${documentId}`}>
          <Box>
            {isNew && (
              <Circle
                size="10px"
                position="absolute"
                top={2}
                right={2}
                bg="red.200"
              />
            )}

            <Image
              src={`${BASE_URL}${thumbnail.url}`}
              alt={title}
              roundedTop="lg"
              h="230px"
              w="full"
              objectFit="cover"
            />

            <Box p={4}>
              {isNew && (
                <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                  New
                </Badge>
              )}

              <Box
                mt={1}
                fontSize="2xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated
              >
                {title}
              </Box>

              <Text
                fontSize="md"
                color="gray.500"
                noOfLines={2}
                minH="48px"
                mt={1}
              >
                {description}
              </Text>
            </Box>
          </Box>
        </Link>

        <Flex justifyContent="space-between" align="center" px={4} pb={4}>
          <Box fontSize="2xl" color={useColorModeValue("gray.800", "white")}>
            <Box as="span" color="gray.600" fontSize="lg">
              $
            </Box>
            {price}
          </Box>

          <Button
            size="sm"
            colorScheme="teal"
            variant="outline"
            leftIcon={<ShoppingCart size={16} />}
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
            Add
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
