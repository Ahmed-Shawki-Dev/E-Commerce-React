import { useDispatch, useSelector } from "react-redux";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  DrawerFooter,
  Button,
  Flex,
  Text,
  IconButton,
} from "@chakra-ui/react";
import type { RootState } from "@/app/store";
import { closeCartDrawer } from "@/app/features/globalSlice";
import { CloseIcon } from "@chakra-ui/icons";
import { clearCartAction } from "@/app/features/cartSlice";
import CartItemsDrawer from "./CartItemsDrawer";
import type { ICart } from "@/interfaces";

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { isCartDrawerOpen } = useSelector((state: RootState) => state.global);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  return (
    <>
      <Drawer
        placement={"right"}
        onClose={() => dispatch(closeCartDrawer())}
        isOpen={isCartDrawerOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" p={4}>
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="bold">
                Basic Drawer
              </Text>
              <IconButton
                aria-label="Close"
                icon={<CloseIcon />}
                onClick={() => dispatch(closeCartDrawer())}
                size="sm"
              />
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            {
            cartItems.length?
            cartItems?.map((item: ICart) => {
              const { title, description, price, thumbnail, qty, documentId } =
                item;
              return (
                <CartItemsDrawer
                  documentId={documentId}
                  key={documentId}
                  title={title}
                  description={description}
                  price={price}
                  thumbnail={thumbnail}
                  qty={qty}
                />
              );
            }):
            "Cart Is Empty..."
            }
          </DrawerBody>
          <DrawerFooter>
            <Button
              type="button"
              colorScheme="red"
              onClick={() => {
                dispatch(clearCartAction());
              }}
            >
              Clear All
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CartDrawer;
