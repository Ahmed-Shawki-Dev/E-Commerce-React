import { Grid } from "@chakra-ui/react";
import SkeletonDesign from "./Skeleton";

const SkeletonLoader = () => {
  return (
    <Grid
      templateColumns={"repeat(auto-fill,minmax(300px,1fr))"}
      gap={6}
      m={30}
    >
      {Array.from({ length: 20 }, (_, idx) => (
        <SkeletonDesign key={idx} />
      ))}
    </Grid>
  );
};

export default SkeletonLoader;
