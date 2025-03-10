"use client";

import { postLayout } from "@api/postLayout";
import Layout from "@components/Layout";
import ThemeProvider from "@components/ThemeProvider";
import {
  Button,
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ConfirmProvider, confirm } from "material-ui-confirm";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [leftUrl, setLeftUrl] = useState("");
  const [rightUrl, setRightUrl] = useState("");

  const createLayout = useCallback(async () => {
    if (!leftUrl || !rightUrl) {
      await confirm({
        title: "Invalid URLs",
        description: "Please enter two URLs to create a layout.",
        hideCancelButton: true,
        confirmationButtonProps: {
          color: "error",
        },
      });
      return;
    }

    const confirmResult = await confirm({
      title: "Confirm to Create Layout",
      description: (
        <Stack spacing={2}>
          <Typography variant="body1">Are you sure you want to create the following layout?</Typography>
          <Table size="small" sx={{ border: "1px solid #e0e0e0" }}>
            <TableHead>
              <TableRow>
                <TableCell className="!font-bold !text-center">Left</TableCell>
                <TableCell className="!font-bold !text-center">Right</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className="!text-center">
                  <a className="underline" href={leftUrl} title={leftUrl} target="_blank">
                    Click here to view
                  </a>
                </TableCell>
                <TableCell className="!text-center">
                  <a className="underline" href={rightUrl} title={rightUrl} target="_blank">
                    Click here to view
                  </a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Stack>
      ),
      cancellationButtonProps: {
        color: "error",
      },
    });
    if (!confirmResult.confirmed) {
      return;
    }

    setIsCreating(true);
    const id = await postLayout({ leftUrl, rightUrl });
    setIsCreating(false);

    if (!id) {
      await confirm({
        title: "Failed to Create Layout",
        description: "Please check the URLs and try again.",
        hideCancelButton: true,
        confirmationButtonProps: {
          color: "error",
        },
      });
    } else {
      setLeftUrl("");
      setRightUrl("");

      router.push(`/${id}`);
    }
  }, [leftUrl, rightUrl, router]);

  return (
    <ThemeProvider>
      <ConfirmProvider>
        <Stack className="h-screen w-full" paddingY={4}>
          <Stack paddingBottom={4} spacing={1} alignItems="center">
            <Typography fontFamily="inherit" fontSize={48} variant="h1">Side by Side</Typography>
            <Typography className="opacity-70" variant="body1">
              Input two websites to display them side by side.
            </Typography>
          </Stack>
          <Divider />
          <Stack flex={1}>
            <Layout
              mode="create"
              leftUrl={leftUrl}
              onLeftUrlChange={setLeftUrl}
              rightUrl={rightUrl}
              onRightUrlChange={setRightUrl}
            />
          </Stack>
          <Divider />
          <Stack paddingTop={4} alignItems="center">
            <Button
              className="!normal-case"
              disabled={!leftUrl || !rightUrl || isCreating}
              variant="contained"
              onClick={createLayout}
            >
              {isCreating && <CircularProgress className="mx-2 my-1" color="inherit" size={18} />}
              {!isCreating && "Create Layout"}
            </Button>
          </Stack>
        </Stack>

        <Typography className="fixed bottom-0 right-1 opacity-50" variant="caption">
          Logo by <a className="underline" href="https://www.flaticon.com/free-icons/ui">Freepik</a>
        </Typography>
      </ConfirmProvider>
    </ThemeProvider>
  );
}
