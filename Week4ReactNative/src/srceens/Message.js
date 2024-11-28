import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import messageService from '../services/messageService'; // Import the service file
import websocketService from '../services/websocketService'; // Import WebSocket service
import {getUsername} from '../utils/authUtils';

const Message = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch recent chats on component mount
  const fetchRecentChats = async () => {
    try {
      setLoading(true);
      const response = await messageService.getRecentChats(0, 10);
      setConversations(response.content);
      setFilteredConversations(response.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recent chats:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentChats();

    // Connect to WebSocket
    websocketService.disconnect();
    websocketService.connect(() => {
      websocketService.subscribe('/topic/recent-chats', newMessage => {
        console.log('New message received:', newMessage);
        // Update the conversation list dynamically
        setConversations(prevConversations => [
          newMessage,
          ...prevConversations,
        ]);
        setFilteredConversations(prevConversations => [
          newMessage,
          ...prevConversations,
        ]);
      });
    });

    // Cleanup WebSocket connection
    return () => {
      websocketService.disconnect();
    };
  }, []);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(
        conversation =>
          conversation.fullName.toLowerCase().includes(query.toLowerCase()) ||
          conversation.bio.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredConversations(filtered);
    }
  };

  const navigateToDetail = async item => {
    const username = await getUsername();
    navigation.navigate('Message Detail', {
      senderUsername: username || '',
      recipientUsername: item.username || '',
      recipientAvatar: item.avatarPath || '',
      recipientFullName: item.fullName || '',
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecentChats();
    setRefreshing(false);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigateToDetail(item)}>
      <Image
        source={{uri: item.avatarPath}}
        style={styles.avatar}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.message} numberOfLines={1}>
          {item.bio}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {/* <TouchableOpacity
          style={styles.reloadButton}
          onPress={fetchRecentChats}>
          <Text style={styles.reloadText}>Reload</Text>
        </TouchableOpacity> */}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          data={filteredConversations}
          keyExtractor={item => item.username}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    color: '#6c757d',
    fontSize: 14,
  },
});

export default Message;
