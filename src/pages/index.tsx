import { Logo } from '@components/Logo'
import { Upload } from '@components/Upload'
import { Box, Container, Divider, Paper, Typography } from '@mui/material'

export default function HomePage() {
  return (
    <Container maxWidth="xs" sx={{ mb: 4 }}>
      <Logo />
      <Paper elevation={4}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="h1" align="center" gutterBottom={false}>
            Upload Custom Target
          </Typography>
          <Typography variant="subtitle2" paragraph={true} align="center">
            A staff member will need to approve your photo for you to be able to use it as a target.
          </Typography>
          <Divider sx={{ my: 4 }} />
          <Upload />
        </Box>
      </Paper>
    </Container>
  )
}
