import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Play, Image, Music, FileText, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { mediaService } from '@/services/MediaService';
import { Media, MediaType } from '@/types/media';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const MediaPreview = styled('div')({
  position: 'relative',
  paddingTop: '56.25%', // 16:9 aspect ratio
  overflow: 'hidden',
});

const MediaIcon = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&.MuiChip-root': {
    cursor: 'pointer',
  },
}));

const MediaGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
}));

interface MediaListProps {
  formationId?: string;
  initialType?: MediaType;
}

export const MediaList: React.FC<MediaListProps> = ({ formationId, initialType }) => {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>(initialType || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: medias, isLoading: isLoadingMedias } = useQuery({
    queryKey: ['medias', formationId, selectedType, selectedCategory],
    queryFn: () => {
      if (formationId) {
        return mediaService.getFormationMedias(formationId);
      }
      if (selectedType !== 'all') {
        return mediaService.getMediasByType(selectedType);
      }
      if (selectedCategory !== 'all') {
        return mediaService.getMediasByCategory(selectedCategory);
      }
      return mediaService.getAllMedias();
    },
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['media-categories'],
    queryFn: () => mediaService.getCategories(),
  });

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'video':
        return <Play />;
      case 'image':
        return <Image />;
      case 'audio':
        return <Music />;
      case 'document':
        return <FileText />;
      default:
        return null;
    }
  };

  const getMediaPreview = (media: Media) => {
    if (media.type === 'video' || media.type === 'image') {
      return (
        <MediaPreview>
          <CardMedia
            component="img"
            image={media.url}
            alt={media.titre}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <MediaIcon size="large">
            {getMediaIcon(media.type)}
          </MediaIcon>
        </MediaPreview>
      );
    }
    return (
      <MediaPreview>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.grey[100],
          }}
        >
          <MediaIcon size="large">
            {getMediaIcon(media.type)}
          </MediaIcon>
        </Box>
      </MediaPreview>
    );
  };

  if (isLoadingMedias || isLoadingCategories) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={3} display="flex" alignItems="center" flexWrap="wrap">
        <FilterChip
          icon={<Filter />}
          label="Tous"
          onClick={() => setSelectedType('all')}
          color={selectedType === 'all' ? 'primary' : 'default'}
        />
        {['video', 'image', 'audio', 'document'].map((type) => (
          <FilterChip
            key={type}
            icon={getMediaIcon(type as MediaType)}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            onClick={() => setSelectedType(type as MediaType)}
            color={selectedType === type ? 'primary' : 'default'}
          />
        ))}
      </Box>

      {categories && categories.length > 0 && (
        <Box mb={3} display="flex" alignItems="center" flexWrap="wrap">
          <FilterChip
            label="Toutes les catégories"
            onClick={() => setSelectedCategory('all')}
            color={selectedCategory === 'all' ? 'primary' : 'default'}
          />
          {categories.map((category) => (
            <FilterChip
              key={category.id}
              label={category.nom}
              onClick={() => setSelectedCategory(category.id)}
              color={selectedCategory === category.id ? 'primary' : 'default'}
            />
          ))}
        </Box>
      )}

      <MediaGrid>
        {medias?.map((media) => (
          <StyledCard key={media.id}>
            {getMediaPreview(media)}
            <CardContent>
              <Typography gutterBottom variant="h6" component="h2" noWrap>
                {media.titre}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {media.description}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  size="small"
                  icon={getMediaIcon(media.type)}
                  label={media.type}
                  variant="outlined"
                />
                {media.categorie && (
                  <Chip
                    size="small"
                    label={media.categorie}
                    variant="outlined"
                  />
                )}
              </Box>
              {media.duree && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Durée: {media.duree}
                </Typography>
              )}
            </CardContent>
          </StyledCard>
        ))}
      </MediaGrid>
    </Box>
  );
}; 