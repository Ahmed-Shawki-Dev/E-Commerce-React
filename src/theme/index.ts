import { extendTheme, type StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const style = {
  global: (props: StyleFunctionProps) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("#f9f9f9", "#141214")(props),
    },
  }),
};

const components = {
  Drawer: {
    baseStyle: (props: StyleFunctionProps) => ({
      dialog: {
        bg: mode("#f9f9f9", "#1a1a1a")(props),
      },
    }),
  },
  Menu: {
    baseStyle: (props: StyleFunctionProps) => ({
      list: {
        bg: mode("#f9f9f9", "#1a1a1a")(props),
      },
    }),
  },
  Skeleton: {
    baseStyle: (props: StyleFunctionProps) => ({
      startColor: mode("gray.100", "gray.700")(props),
      endColor: mode("gray.300", "gray.600")(props),
    }),
    defaultProps: {
      startColor: "gray.100",
      endColor: "gray.300",
    },
  },
};

export const theme = extendTheme({
  styles: style,
  components,
});
