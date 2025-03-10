"use client";

import ThemeProvider from "@components/ThemeProvider";
import { Box, CircularProgress, Divider, Stack, TextField, Typography } from "@mui/material";
import clamp from "lodash/clamp";
import prependHttp from "prepend-http";
import { HTMLProps, useCallback, useEffect, useRef, useState } from "react";

interface LayoutProps {
  mode: "create" | "view";
  leftUrl: string;
  onLeftUrlChange?: (url: string) => void;
  rightUrl: string;
  onRightUrlChange?: (url: string) => void;
}

const IframeWithLoader = (props: HTMLProps<HTMLIFrameElement>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
  }, [props.src]);

  return (
    <>
      {isLoading && (
        <Stack className="flex-1 h-full items-center justify-center">
          <CircularProgress />
        </Stack>
      )}
      {isError && (
        <Stack className="flex-1 h-full items-center justify-center">
          <Typography className="opacity-50" variant="h6">Not Available</Typography>
        </Stack>
      )}
      <iframe
        {...props}
        src={props.src && prependHttp(props.src)}
        className={isLoading ? "hidden" : props.className}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setIsError(true);
        }}
      />
    </>
  );
};

const Layout = ({
  mode,
  leftUrl,
  onLeftUrlChange,
  rightUrl,
  onRightUrlChange,
}: LayoutProps) => {
  const [dividerRef, setDividerRef] = useState<HTMLDivElement | null>(null);
  const [flexLeft, setFlexLeft] = useState(1); // used in styling
  const flexLeftRef = useRef(1); // used in resizing math

  useEffect(() => {
    flexLeftRef.current = flexLeft;
  }, [flexLeft]);

  const handleStartResize = useCallback((event: PointerEvent) => {
    if (!dividerRef?.contains(event.target as Node)) {
      return;
    }

    dividerRef?.classList.add("active");

    const startX = event.clientX;
    const totalWidth = startX * (flexLeftRef.current + 1) / flexLeftRef.current;

    const getNewFlexLeft = (event: PointerEvent) => {
      const newStartX = event.clientX;
      const newFlexLeft = newStartX / (totalWidth - newStartX);
      return clamp(newFlexLeft, 0.5, 2); // min 1/3, max 2/3 of total width
    };

    const handleResize = (event: PointerEvent) => {
      setFlexLeft(getNewFlexLeft(event));
    };

    const handleEndResize = () => {
      dividerRef?.classList.remove("active");
      document.removeEventListener("pointermove", handleResize);
      document.removeEventListener("pointerup", handleEndResize);
    };

    document.addEventListener("pointermove", handleResize);
    document.addEventListener("pointerup", handleEndResize);
  }, [dividerRef]);

  useEffect(() => {
    document.addEventListener("pointerdown", handleStartResize);
    return () => document.removeEventListener("pointerdown", handleStartResize);
  }, [handleStartResize]);

  return (
    <ThemeProvider>
      <Stack direction="row" className="w-full h-full">
        <Stack
          className={`h-full ${!leftUrl && mode === "view" ? "bg-gray-200" : ""}`}
          paddingTop={mode === "create" ? 1 : 0}
          style={{ flex: flexLeft }}
        >
          {mode === "view" && leftUrl && (
            <IframeWithLoader src={leftUrl} height="100%" width="100%" />
          )}

          {mode === "view" && !leftUrl && (
            <Stack className="flex-1 h-full items-center justify-center">
              <Typography className="opacity-50" variant="h6">Not Available</Typography>
            </Stack>
          )}

          {mode === "create" && (
            <Stack className="flex-1 h-full items-center justify-center" spacing={1}>
              <Box className="w-full" paddingX={4}>
                <TextField
                  fullWidth
                  label="Left URL"
                  size="small"
                  value={leftUrl}
                  helperText={<><strong>Caution:</strong> May not work with all websites.</>}
                  onChange={(e) => onLeftUrlChange?.(e.target.value)}
                />
              </Box>
              {leftUrl && <IframeWithLoader src={leftUrl} height="100%" width="100%" />}
            </Stack>
          )}
        </Stack>

        <Divider ref={setDividerRef} className="divider" orientation="vertical" flexItem />

        <Stack
          className={`flex-1 h-full ${!rightUrl && mode === "view" ? "bg-gray-200" : ""}`}
          paddingTop={mode === "create" ? 1 : 0}
        >
          {mode === "view" && rightUrl && (
            <IframeWithLoader src={rightUrl} height="100%" width="100%" />
          )}

          {mode === "view" && !rightUrl && (
            <Stack className="flex-1 h-full items-center justify-center">
              <Typography className="opacity-50" variant="h6">Not Available</Typography>
            </Stack>
          )}

          {mode === "create" && (
            <Stack className="flex-1 h-full items-center justify-center" spacing={1}>
              <Box className="w-full" paddingX={4}>
                <TextField
                  fullWidth
                  label="Right URL"
                  size="small"
                  value={rightUrl}
                  helperText={<><strong>Caution:</strong> May not work with all websites.</>}
                  onChange={(e) => onRightUrlChange?.(e.target.value)}
                />
              </Box>
              {rightUrl && <IframeWithLoader src={rightUrl} height="100%" width="100%" />}
            </Stack>
          )}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default Layout;
