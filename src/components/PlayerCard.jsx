import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

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
  const placeholderImageUrl = 'https://via.placeholder.com/120x180.png?text=No+Player+Image';

  const rank = player.scoutRankings?.averageMavericksRank;
  const displayRank = rank != null ? rank.toFixed(1) : 'N/A';

  return (
    <Card sx={{ height: 220, width: 160, display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`/player/${player.playerId}`} sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
        {player.photoUrl ? (
          <CardMedia
            component="img"
            sx={{
              width: 120,
              height: 180,
              objectFit: 'cover',
              mx: 'auto',
              my: 1,
              borderRadius: 1,
            }}
            image={player.photoUrl}
            alt={`${player.firstName} ${player.lastName}`}
            onError={(e) => { e.target.src = placeholderImageUrl; }}
          />
        ) : (
          <Avatar
            variant="square"
            sx={{
              width: 120,
              height: 180,
              fontSize: '1.5rem',
              backgroundColor: 'grey.300',
              mx: 'auto',
              my: 1,
              borderRadius: 1,
            }}
          >
            {player.firstName?.[0]}{player.lastName?.[0]}
          </Avatar>
        )}
        <CardContent sx={{ p: 1 }}>
          <Typography gutterBottom variant="subtitle1" component="div" noWrap>
            {player.firstName} {player.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            Avg. Scout Rank: {displayRank}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PlayerCard;
