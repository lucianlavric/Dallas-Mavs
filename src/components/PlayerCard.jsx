import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Avatar } from '@mui/material';

// Helper to convert inches to feet/inches
function getHeightInFeetInches(heightInInches) {
  if (!heightInInches || isNaN(heightInInches)) return 'N/A';
  const feet = Math.floor(heightInInches / 12);
  const inches = heightInInches % 12;
  return `${feet}' ${inches}"`;
}

// Helper to calculate age from birthDate (expects YYYY-MM-DD)
function getAge(birthDate) {
  if (!birthDate) return 'N/A';
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

const PlayerCard = ({ player }) => {
  const placeholderImageUrl = 'https://via.placeholder.com/200x300.png?text=No+Player+Image';

  const rank = player.scoutRankings?.averageMavericksRank;
  const displayRank = rank != null ? rank.toFixed(1) : 'N/A';

  // Define a fixed height for the image/avatar area
  const imageHeight = 150; // Example height, can be adjusted
  const imageWidth = 120; // Example width, can be adjusted

  return (
    <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}> {/* Removed height: '100%' from Card */}
      <CardActionArea 
        component={RouterLink} 
        to={`/player/${player.playerId}`} 
        sx={{ display: 'flex', flexDirection: 'row', width: '100%', textDecoration: 'none', color: 'inherit' }}
      >
        {player.photoUrl ? (
          <CardMedia
            component="img"
            sx={{
              width: imageWidth,
              height: imageHeight,
              objectFit: 'cover',
              flexShrink: 0 // Prevent image from shrinking
            }}
            image={player.photoUrl}
            alt={`${player.firstName} ${player.lastName}`}
            onError={(e) => { e.target.src = placeholderImageUrl; }}
          />
        ) : (
          <Avatar
            variant="square"
            sx={{
              width: imageWidth,
              height: imageHeight,
              fontSize: '2rem',
              backgroundColor: 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0 // Prevent avatar from shrinking
            }}
          >
            {player.firstName?.[0]}{player.lastName?.[0]}
          </Avatar>
        )}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2, overflow: 'hidden' }}> {/* Added overflow: hidden and justifyContent: 'center' */}
          <Typography gutterBottom variant="h6" component="div" noWrap sx={{lineHeight: 1.2, mb: 0.5 }}> {/* Ensure noWrap is effective for single-line ellipsis */}
            {player.firstName} {player.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Avg. Scout Rank: {displayRank}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Team: {player.currentTeam ? player.currentTeam : 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Height: {getHeightInFeetInches(player.height)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Age: {getAge(player.birthDate)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Weight: {player.weight ? `${player.weight} lbs` : 'N/A'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PlayerCard;
