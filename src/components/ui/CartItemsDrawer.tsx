import { removeItemFromCartAction } from "@/app/features/cartSlice";
import type { ICart } from "@/interfaces";
import { Button, Divider, Flex, Img, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

const CartItemsDrawer = ({
  documentId,
  title,
  description,
  price,
  thumbnail,
  qty,
}: ICart) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);
  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Flex
          gap={4}
          py={3}
          align="center"
          justify="space-between"
          wrap="nowrap"
        >
          <Img
            src={`${thumbnail?.url}`}
            boxSize="60px"
            borderRadius="md"
            objectFit="cover"
            flexShrink={0}
          />

          <Flex direction="column" flex="1" overflow="hidden">
            <Text fontWeight="medium" fontSize="sm" isTruncated>
              {title}
            </Text>
            <Text fontSize="xs" color="gray.500" noOfLines={2}>
              {description}
            </Text>

            <Flex mt={1} justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="semibold" color="green">
                ${+price * +qty}
              </Text>
              <Text fontSize="xs">Qty: {qty}</Text>
            </Flex>
          </Flex>

          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                dispatch(
                  removeItemFromCartAction(documentId ? documentId : ""),
                );
              }, 300);
            }}
          >
            Remove
          </Button>
        </Flex>
      </motion.div>

      <Divider />
    </>
  );
};

export default CartItemsDrawer;
