import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardMedia, Typography, Avatar, Box, Stack, Grid } from '@mui/material';
import { getAge, getHeightInFeetInches } from '../utils/playerUtils';
import { memo } from 'react';

const PlayerCard = memo(({ player }) => {
  const placeholderImageUrl = 'https://via.placeholder.com/200x300.png?text=No+Player+Image';
  const rank = player.scoutRankings?.averageMavericksRank;
  const displayRank = rank != null ? rank.toFixed(1) : 'N/A';

  return (
    <Card 
      sx={{ 
        width: '100%',
        bgcolor: "#ffffff",
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        mb: 2
      }}
    >
      <CardActionArea component={RouterLink} to={`/player/${player.playerId}`}>
        <Box sx={{ 
          display: 'flex', 
          p: 2,
          flexDirection: { xs: 'column', sm: 'row' } 
        }}>
          {/* Left side - Photo */}
          {player.photoUrl ? (
            <CardMedia
              component="img"
              sx={{
                width: { xs: '100%', sm: 120 },
                height: { xs: 240, sm: 160 }, // Adjusted height for mobile
                borderRadius: 1,
                objectFit: 'cover',
                mb: { xs: 2, sm: 0 }, // Margin bottom on mobile
              }}
              image={player.photoUrl}
              alt={`${player.firstName} ${player.lastName}`}
              onError={(e) => { e.target.src = placeholderImageUrl; }}
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={{
                width: { xs: '100%', sm: 120 },
                height: { xs: 240, sm: 160 }, // Adjusted height for mobile
                bgcolor: '#f5f5f5',
                color: '#0D47A1',
                fontSize: { xs: '4rem', sm: '2rem'}, // Larger initials on mobile
                mb: { xs: 2, sm: 0 }, // Margin bottom on mobile
              }}
            >
              {player.firstName?.[0]}{player.lastName?.[0]}
            </Avatar>
          )}

          {/* Right side - Content */}
          <Box sx={{ 
            flex: 1, 
            ml: { xs: 0, sm: 3 }, // No left margin on mobile
            mt: { xs: 2, sm: 0 }  // Top margin on mobile
          }}>
            {/* Position and Name */}
            <Typography variant="subtitle1" sx={{ 
              color: '#1976D2', 
              fontWeight: 'bold', 
              mb: -0.5,
              fontSize: '0.875rem',
              textAlign: { xs: 'center', sm: 'left'} // Center position on mobile
            }}>
              {player.position || 'FORWARD'}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              flexDirection: { xs: 'column', sm: 'row' }, // Stack name and rank on mobile
              textAlign: { xs: 'center', sm: 'left'} 
            }}>
              <Typography variant="h2" sx={{ 
                fontWeight: 'bold', 
                color: '#1e3c72',
                fontSize: { xs: '2.5rem', sm: '4rem' }, // Reduced font size for mobile
                lineHeight: 1,
                mb: { xs: 1, sm: 0 }, // Margin bottom for name on mobile
                mt: 0
              }}>
                {player.firstName} {player.lastName}
              </Typography>
              <Box sx={{ 
                ml: { xs: 0, sm: 'auto' }, // No left margin on mobile, auto for sm
                mt: { xs: 1, sm: 0 },    // Top margin for rank box on mobile
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: '#f8f9fa',
                borderRadius: 2,
                p: 1,
                minWidth: { xs: '80%', sm: 100 } // Wider rank box on mobile
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: '#1976D2',
                    fontWeight: 'bold',
                    lineHeight: 1
                  }}
                >
                  {displayRank}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#666', 
                    fontWeight: 'medium',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    mt: 0.5
                  }}
                >
                  Avg Scout Rank
                </Typography>
              </Box>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={1} sx={{ mt: { xs: 2, sm: 0.5} }}> 
              {[
                { label: 'TEAM', value: player.currentTeam || 'N/A' },
                { label: 'HEIGHT', value: getHeightInFeetInches(player.height) },
                { label: 'WEIGHT', value: player.weight ? `${player.weight} lbs` : 'N/A' },
                { label: 'BORN', value: new Date(player.birthDate).toLocaleDateString() },
                { label: 'AGE', value: getAge(player.birthDate) }
              ].map((stat) => (
                <Grid item xs={6} sm={2.4} key={stat.label}> {/* Changed xs to 6 for 2 stats per row on mobile */}
                  <Box sx={{ textAlign: 'center', py: 0.25, px: 1 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#666',
                        fontSize: { xs: '0.65rem', sm: '0.7rem' }, // Slightly smaller font for mobile
                        fontWeight: 'bold',
                        letterSpacing: '0.1em',
                        mb: 0.25,
                        display: 'block'
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#1e3c72',
                        fontSize: { xs: '1rem', sm: '1.25rem' }, // Smaller font for mobile
                        lineHeight: 1
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to determine if component should update
  return prevProps.player.playerId === nextProps.player.playerId &&
         prevProps.player.scoutRankings?.averageMavericksRank === nextProps.player.scoutRankings?.averageMavericksRank;
});

export default PlayerCard;
