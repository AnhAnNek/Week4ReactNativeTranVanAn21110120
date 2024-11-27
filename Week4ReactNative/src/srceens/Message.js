import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

// Dummy data
const conversations = [
  {
    id: '1',
    name: 'John Doe',
    message: "Hey, how's it going?",
    avatarUrl:
      'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    name: 'Alice Smith',
    message: 'Are you coming to the meeting?',
    avatarUrl:
      'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
    timestamp: '09:15 AM',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    message: "Let's catch up soon!",
    avatarUrl:
      'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
    timestamp: 'Yesterday',
  },
  {
    id: '4',
    name: 'Emily Davis',
    message: 'Got your email, thanks!',
    avatarUrl:
      'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
    timestamp: '2 days ago',
  },
];

const Message = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] =
    useState(conversations);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(
        conversation =>
          conversation.name.toLowerCase().includes(query.toLowerCase()) ||
          conversation.message.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredConversations(filtered);
    }
  };

  const navigateToDetail = () => {
    // Navigate to message detail screen
    navigation.navigate('MessageDetail');
  };

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.itemContainer} onPress={navigateToDetail}>
      <Image
        source={{uri: item.avatarUrl}}
        style={styles.avatar}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
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
      </View>
      <FlatList
        data={filteredConversations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
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
  timestamp: {
    fontSize: 12,
    color: '#6c757d',
  },
});

export default Message;
