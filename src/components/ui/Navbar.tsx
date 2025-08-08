import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  useColorMode,
  IconButton,
  Center,
  Text,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { useEffect } from "react";
import { fetchUserData } from "@/app/features/UserSlice";
import CookieService from "@/services/CookieService";
import { ShoppingCart } from "lucide-react";
import { openCartDrawer } from "@/app/features/globalSlice";

export default function Nav() {
  const jwt = CookieService.get("jwt");
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.user);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  useEffect(() => {
    if (!jwt || data) return;
    dispatch(fetchUserData(jwt));
  }, [jwt, data, dispatch]);

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      px={8}
      py={3}
      position="sticky"
      top={0}
      zIndex="banner"
      boxShadow="sm"
    >
      <Flex align="center" justify="space-between" h={16}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            fontFamily="'Patrick Hand', cursive"
          >
            Hazem Store
          </Text>
        </Link>
        <Box>
          <Link to={"/dashboard"}>Dashboard</Link>
        </Box>
        <Stack direction="row" spacing={3} align="center">
          <Button
            leftIcon={<ShoppingCart size={18} />}
            size="sm"
            variant="solid"
            colorScheme="blue"
            onClick={() => dispatch(openCartDrawer())}
          >
            ({cartItems.length})
          </Button>

          {!jwt && (
            <Link to="/login">
              <Button size="sm" variant="ghost">
                Login
              </Button>
            </Link>
          )}

          <IconButton
            size="sm"
            variant="ghost"
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            aria-label="Toggle color mode"
          />

          {jwt && (
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" minW={0}>
                <Avatar size="sm" src="/public/file.jpg" />
              </MenuButton>
              <MenuList alignItems="center">
                <Center py={4}>
                  <Avatar size="2xl" src="/public/file.jpg" />
                </Center>
                <Center pb={2}>
                  <Text fontWeight="semibold">{data?.username}</Text>
                </Center>
                <MenuDivider />
                <MenuItem>Your Servers</MenuItem>
                <MenuItem>Account Settings</MenuItem>
                <MenuItem
                  onClick={async () => {
                    await CookieService.remove("jwt");
                    window.location.reload();
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
