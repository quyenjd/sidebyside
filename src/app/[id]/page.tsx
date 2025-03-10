import { getLayout } from "@api/getLayout";
import Layout from "@components/Layout";
import { CircularProgress, Stack, Typography } from "@mui/material";

const ViewLayoutPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const layout = await getLayout((await params).id);

  if (!layout) {
    return (
      <Stack height="100vh" justifyContent="center" alignItems="center">
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={48} />
          <Typography className="opacity-70" fontFamily="inherit" variant="body1">Hang tight!</Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack className="h-screen w-full">
      <Layout mode="view" leftUrl={layout.leftUrl} rightUrl={layout.rightUrl} />
    </Stack>
  );
}

export default ViewLayoutPage;
