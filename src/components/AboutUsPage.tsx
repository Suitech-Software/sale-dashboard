import { Box, Typography } from '@mui/material';
import React from 'react';
import Reveal from './Reveal';
import Footer from './Footer';

function AboutUsPage() {
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Box
        sx={{
          px: { xs: '20px', sm: '50px', md: '100px' },
          pt: '30px',
          mt: { xs: '50px', lg: '100px' },
          display: 'flex',
          justifyContent: { xs: 'center', lg: 'space-around' },
          alignItems: { xs: 'center', lg: 'flex-start' },
          flexDirection: { xs: 'column', lg: 'row' },
          width: '100%',
          height: 'auto',
        }}
      >
        <Box
          sx={{
            mt: '50px',
            display: 'flex',
            justifyContent: { xs: 'center', lg: 'flex-start' },
            alignItems: { xs: 'center', lg: 'flex-start' },
            flexDirection: { xs: 'column' },
          }}
        >
          <Reveal>
            <Box>
              <Typography
                sx={{
                  background:
                    'linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                  display: 'inline-flex',
                  fontSize: { xs: '27px', sm: '50px', lg: '70px' },
                  fontWeight: '600',
                }}
              >
                About
              </Typography>
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: { xs: '27px', sm: '50px', lg: '70px' },
                  fontWeight: '600',
                  display: 'inline-flex',
                  ml: '12px',
                }}
              >
                Us
              </Typography>
            </Box>
          </Reveal>
          <Box
            sx={{
              width: { xs: '80%', sm: '60%', lg: '500px' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: { xs: '20px' },
            }}
          >
            <Reveal>
              <Typography
                sx={{
                  color: 'rgb(130,130,129)',
                  fontSize: '13px',
                  letterSpacing: '1px',
                  textAlign: 'justify',
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry&apos;s
                standard dummy text ever since the 1500s, when an unknown
                printer took a galley of type and scrambled it to make a type
                specimen book. It has survived not only five centuries, but also
                the leap into electronic typesetting, remaining essentially
                unchanged. It was popularised in the 1960s with the release of
                Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum.Lorem Ipsum is simply dummy
                text of the printing and typesetting industry. Lorem Ipsum has
                been the industry&apos;s standard dummy text ever since the 1500s,
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen book. It has survived not only five
                centuries, but also the leap into electronic typesetting,
                remaining essentially unchanged.
              </Typography>
            </Reveal>
          </Box>
        </Box>
        <Reveal>
          <Box
            component="img"
            src="/6.png"
            alt="BNB Logo"
            sx={{
              width: {
                xs: '300px',
                sm: '400px',
                md: 600,
              },
              height: {
                xs: '300px',
                sm: '400px',
                md: 700,
              },
              objectFit: 'contain',
            }}
          />
        </Reveal>
      </Box>

      <Reveal>
        <Footer />
      </Reveal>
    </Box>
  );
}

export default AboutUsPage;
