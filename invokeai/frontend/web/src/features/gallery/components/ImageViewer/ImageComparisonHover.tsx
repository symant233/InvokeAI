import { Box, Flex, Image } from '@invoke-ai/ui-library';
import { useAppSelector } from 'app/store/storeHooks';
import { useBoolean } from 'common/hooks/useBoolean';
import { preventDefault } from 'common/util/stopPropagation';
import type { Dimensions } from 'features/canvas/store/canvasTypes';
import { STAGE_BG_DATAURL } from 'features/controlLayers/util/renderers';
import { ImageComparisonLabel } from 'features/gallery/components/ImageViewer/ImageComparisonLabel';
import { memo, useMemo, useRef } from 'react';

import type { ComparisonProps } from './common';
import { fitDimsToContainer, getSecondImageDims } from './common';

export const ImageComparisonHover = memo(({ firstImage, secondImage, containerDims }: ComparisonProps) => {
  const comparisonFit = useAppSelector((s) => s.gallery.comparisonFit);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const mouseOver = useBoolean(false);
  const fittedDims = useMemo<Dimensions>(
    () => fitDimsToContainer(containerDims, firstImage),
    [containerDims, firstImage]
  );
  const compareImageDims = useMemo<Dimensions>(
    () => getSecondImageDims(comparisonFit, fittedDims, firstImage, secondImage),
    [comparisonFit, fittedDims, firstImage, secondImage]
  );
  return (
    <Flex w="full" h="full" maxW="full" maxH="full" position="relative" alignItems="center" justifyContent="center">
      <Flex
        id="image-comparison-wrapper"
        w="full"
        h="full"
        maxW="full"
        maxH="full"
        position="absolute"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          ref={imageContainerRef}
          position="relative"
          id="image-comparison-hover-image-container"
          w={fittedDims.width}
          h={fittedDims.height}
          maxW="full"
          maxH="full"
          userSelect="none"
          overflow="hidden"
          borderRadius="base"
        >
          <Image
            id="image-comparison-hover-first-image"
            src={firstImage.image_url}
            fallbackSrc={firstImage.thumbnail_url}
            w={fittedDims.width}
            h={fittedDims.height}
            maxW="full"
            maxH="full"
            objectFit="cover"
            objectPosition="top left"
          />
          <ImageComparisonLabel type="first" opacity={mouseOver.isTrue ? 0 : 1} />

          <Box
            id="image-comparison-hover-second-image-container"
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            overflow="hidden"
            opacity={mouseOver.isTrue ? 1 : 0}
            transitionDuration="0.2s"
            transitionProperty="common"
          >
            <Box
              id="image-comparison-hover-bg"
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              backgroundImage={STAGE_BG_DATAURL}
              backgroundRepeat="repeat"
              opacity={0.2}
            />
            <Image
              position="relative"
              id="image-comparison-hover-second-image"
              src={secondImage.image_url}
              fallbackSrc={secondImage.thumbnail_url}
              w={compareImageDims.width}
              h={compareImageDims.height}
              maxW={fittedDims.width}
              maxH={fittedDims.height}
              objectFit={comparisonFit}
              objectPosition="top left"
            />
            <ImageComparisonLabel type="second" opacity={mouseOver.isTrue ? 1 : 0} />
          </Box>
          <Box
            id="image-comparison-hover-interaction-overlay"
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            onMouseOver={mouseOver.setTrue}
            onMouseOut={mouseOver.setFalse}
            onContextMenu={preventDefault}
            userSelect="none"
          />
        </Box>
      </Flex>
    </Flex>
  );
});

ImageComparisonHover.displayName = 'ImageComparisonHover';
