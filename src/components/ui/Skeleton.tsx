import { Skeleton, SkeletonText, Stack, VStack } from "@chakra-ui/react";

const SkeletonDesign = () => {
  return (
    <Stack gap="6" maxW="sm">
      <Skeleton height="200px" />
      <VStack width="full">
        <SkeletonText noOfLines={3} />
      </VStack>
    </Stack>
  );
};

export default SkeletonDesign;
