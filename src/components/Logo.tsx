import Image from 'next/image'
import { Box } from '@mui/material'

export function Logo() {
  return (
    <Box sx={{ my: 6, display: 'flex', justifyContent: 'center' }}>
      <Image src={'/logo.svg'} alt="Logo" width={300} height={110} priority={true} />
    </Box>
  )
}
