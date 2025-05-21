import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Renamed to avoid conflict with MUI Link
import { Card, CardActionArea, CardContent, CardMedia, Typography, Avatar } from '@mui/material';

const PlayerCard = ({ player }) => {
  const placeholderImageUrl = 'https://via.placeholder.com/200x300.png?text=No+Player+Image'; // More descriptive placeholder

  const rank = player.scoutRankings?.averageMavericksRank;
  const displayRank = rank != null ? rank.toFixed(1) : 'N/A';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`/player/${player.playerId}`} sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
        {player.photoUrl ? (
          <CardMedia
            component="img"
            sx={{
              height: 300, // Standardized height
              objectFit: 'cover', // Ensure image covers the area
            }}
            image={player.photoUrl}
            alt={`${player.firstName} ${player.lastName}`}
            onError={(e) => { e.target.src = placeholderImageUrl; }} // Fallback if image fails to load
          />
        ) : (
          <Avatar
            variant="square"
            sx={{
              width: '100%',
              height: 300, // Standardized height for avatar as well
              fontSize: '2rem', // Adjust font size for initials if needed
              backgroundColor: 'grey.300' // Placeholder background color
            }}
          >
            {/* Display initials or a generic icon if no photo */}
            {player.firstName?.[0]}{player.lastName?.[0]}
          </Avatar>
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {player.firstName} {player.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Avg. Rank: {displayRank}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Position: {player.position}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Team: {player.teamName ? `${player.teamName} (${player.teamConference})` : 'N/A'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PlayerCard;
