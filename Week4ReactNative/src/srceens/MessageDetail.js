import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import websocketService from '../services/websocketService';
import messageService from '../services/messageService';
import {formatDate} from '../utils/methods';

const MessageDetail = ({route}) => {
  const {
    senderUsername,
    recipientUsername,
    recipientAvatar,
    recipientFullName,
  } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 75 : 0;

  // Track if WebSocket is already subscribed
  const subscribed = useRef(false);

  const fetchMessages = async () => {
    try {
      const response = await messageService.getAllMessages(
        senderUsername,
        recipientUsername,
        0,
        100,
      );
      setMessages(response.content || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        type: 'TEXT',
        content: message,
        senderUsername: senderUsername || '',
        recipientUsername: recipientUsername || '',
      };
      websocketService.send(`/app/messages`, newMessage);
      setMessage('');

      // Ensure flatListRef.current is not null before calling scrollToEnd
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({animated: true});
        }
      }, 100);
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!subscribed.current) {
      websocketService.connect(() => {
        websocketService.subscribe(
          `/topic/messages/${senderUsername}`,
          newMessage => {
            setMessages(prevMessages => [
              ...prevMessages,
              {
                ...newMessage,
              },
            ]);
          },
        );

        websocketService.subscribe(
          `/topic/messages/${recipientUsername}`,
          newMessage => {
            setMessages(prevMessages => [
              ...prevMessages,
              {
                ...newMessage,
              },
            ]);
          },
        );
        subscribed.current = true; // Set to true once subscribed
      });
    }

    return () => {
      // Disconnect WebSocket and reset subscription state
      if (subscribed.current) {
        websocketService.disconnect();
        subscribed.current = false;
      }
    };
  }, [senderUsername, recipientUsername]);

  const renderItem = ({item}) => {
    const isSender = item.senderUsername === senderUsername;
    return (
      <View
        style={[
          styles.messageContainer,
          {
            alignSelf: isSender ? 'flex-end' : 'flex-start',
          },
        ]}>
        <View
          style={[
            styles.messageBubble,
            {backgroundColor: isSender ? '#cce4ff' : '#f2f2f2'},
          ]}>
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.timestamp}>{formatDate(item.sendingTime)}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <Image source={{uri: recipientAvatar}} style={styles.avatar} />
            <Text style={styles.headerText}>{recipientFullName}</Text>
          </View>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()} // Ensure unique keys
            contentContainerStyle={styles.messagesList}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              // Scroll to the end when content changes
              if (flatListRef.current) {
                flatListRef.current.scrollToEnd({animated: true});
              }
            }}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007bff',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MessageDetail;
