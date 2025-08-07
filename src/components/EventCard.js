import React from 'react';
import { 
  Card, 
  CardGrid, 
  Title, 
  Text, 
  Button, 
  Div,
  Badge,
  Avatar
} from '@vkontakte/vkui';
import { Icon28CalendarOutline, Icon28PlaceOutline, Icon28UserOutline, Icon28DeleteOutline } from '@vkontakte/icons';
import { dateUtils } from '../services/api';
import PropTypes from 'prop-types';

export const EventCard = ({ event, onPress, isRegistered, showRegisterButton = true, onDelete, isOwner = false }) => {
  const registrationsCount = event.registrations_count || 0;

  const handlePress = () => {
    if (onPress) {
      onPress(event);
    }
  };

  return (
    <CardGrid size="l">
      <Card 
        mode="shadow" 
        onClick={handlePress}
        style={{
          backgroundColor: '#1A1A1A',
          border: '1px solid #333',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <Div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <Title level="3" style={{ color: '#FFFFFF', margin: 0, flex: 1 }}>
              {event.title}
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isRegistered && (
                <Badge mode="prominent" style={{ backgroundColor: '#0077FF' }}>
                  Записан
                </Badge>
              )}
              {isOwner && (
                <Button
                  mode="tertiary"
                  size="s"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDelete) onDelete(event);
                  }}
                  style={{
                    color: '#FF3B30',
                    padding: '4px',
                    minWidth: 'auto',
                  }}
                >
                  <Icon28DeleteOutline />
                </Button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Icon28CalendarOutline style={{ color: '#0077FF', marginRight: '8px' }} />
            <Text style={{ color: '#CCCCCC' }}>
              {dateUtils.formatDate(event.date)}
            </Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Icon28PlaceOutline style={{ color: '#0077FF', marginRight: '8px' }} />
            <Text style={{ color: '#CCCCCC' }}>
              {event.location}
            </Text>
          </div>

          <Text style={{ 
            color: '#AAAAAA', 
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.4'
          }}>
            {event.description}
          </Text>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon28UserOutline style={{ color: '#0077FF', marginRight: '4px' }} />
              <Text style={{ color: '#888888', fontSize: '14px' }}>
                {registrationsCount} участников
              </Text>
            </div>

            {showRegisterButton && !isRegistered && (
              <Button 
                mode="primary" 
                size="s"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPress) onPress(event);
                }}
                style={{
                  backgroundColor: '#0077FF',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                Записаться
              </Button>
            )}

            {showRegisterButton && isRegistered && (
              <Button 
                mode="secondary" 
                size="s"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPress) onPress(event);
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #0077FF',
                  color: '#0077FF',
                  borderRadius: '8px',
                }}
              >
                Отменить
              </Button>
            )}
          </div>
        </Div>
      </Card>
    </CardGrid>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    created_by: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    vk_link: PropTypes.string,
    registrations_count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func,
  isRegistered: PropTypes.bool,
  showRegisterButton: PropTypes.bool,
  onDelete: PropTypes.func,
  isOwner: PropTypes.bool,
}; 