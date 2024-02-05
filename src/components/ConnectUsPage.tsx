import { Box, Typography } from '@mui/material';
import React from 'react';
import Reveal from './Reveal';
import Footer from './Footer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FaxIcon from '@mui/icons-material/Fax';

function ConnectUsPage() {
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
                Connect
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
          <Reveal>
            <Box
              sx={{
                width: { xs: '100%' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: { xs: '20px' },
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(80,80,80,.4)',
                      backdropFilter: 'blur(32px)',
                      borderRadius: '20px',
                      width: '180px',
                      height: '180px',
                      justifyContent: 'center',
                      display: 'flex',
                      p: '20px',
                      alignItems: 'center',
                      flexDirection: 'column',
                      mt: { xs: '20px', sm: '0px' },
                    }}
                  >
                    <LocationOnIcon
                      sx={{
                        fill: 'white',
                        width: '25px',
                        height: '25px',
                      }}
                    />
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: { xs: '18px' },
                        fontWeight: '600',
                        display: 'inline-flex',
                        mt: '10px',
                      }}
                    >
                      Location
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgb(130,130,129)',
                        fontSize: '11px',
                        letterSpacing: '1px',
                        textAlign: 'center',
                        mt: '10px',
                      }}
                    >
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: 'rgba(80,80,80,.4)',
                      backdropFilter: 'blur(32px)',
                      width: '180px',
                      height: '180px',
                      borderRadius: '20px',
                      display: 'flex',
                      justifyContent: 'center',
                      p: '20px',
                      alignItems: 'center',
                      flexDirection: 'column',
                      ml: { xs: '0px', sm: '20px' },
                      mt: { xs: '20px', sm: '0px' },
                    }}
                  >
                    <PhoneIcon
                      sx={{
                        fill: 'white',
                        width: '25px',
                        height: '25px',
                      }}
                    />
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: { xs: '18px' },
                        fontWeight: '600',
                        display: 'inline-flex',
                        mt: '10px',
                      }}
                    >
                      Phone
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgb(130,130,129)',
                        fontSize: '11px',
                        letterSpacing: '1px',
                        textAlign: 'center',
                        mt: '10px',
                      }}
                    >
                      +10223 232 2323
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    mt: { xs: '0px', sm: '20px' },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(80,80,80,.4)',
                      backdropFilter: 'blur(32px)',
                      width: '180px',
                      height: '180px',
                      borderRadius: '20px',
                      display: 'flex',
                      p: '20px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      mt: { xs: '20px', sm: '0px' },
                    }}
                  >
                    <EmailIcon
                      sx={{
                        fill: 'white',
                        width: '25px',
                        height: '25px',
                      }}
                    />
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: { xs: '18px' },
                        fontWeight: '600',
                        display: 'inline-flex',
                        mt: '10px',
                      }}
                    >
                      E-Mail
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgb(130,130,129)',
                        fontSize: '11px',
                        letterSpacing: '1px',
                        textAlign: 'center',
                        mt: '10px',
                      }}
                    >
                      help@goldencobra.com
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: 'rgba(80,80,80,.4)',
                      backdropFilter: 'blur(32px)',
                      width: '180px',
                      height: '180px',
                      borderRadius: '20px',
                      display: 'flex',
                      p: '20px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      ml: { xs: '0px', sm: '20px' },
                      mt: { xs: '20px', sm: '0px' },
                    }}
                  >
                    <FaxIcon
                      sx={{
                        fill: 'white',
                        width: '30px',
                        height: '30px',
                      }}
                    />
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: { xs: '18px' },
                        fontWeight: '600',
                        display: 'inline-flex',
                        mt: '10px',
                      }}
                    >
                      Fax
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgb(130,130,129)',
                        fontSize: '11px',
                        letterSpacing: '1px',
                        textAlign: 'center',
                        mt: '10px',
                      }}
                    >
                      1-234-567-8900
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Reveal>
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

export default ConnectUsPage;
