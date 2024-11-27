import React, {useState, useRef, useEffect} from 'react';
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

const initialMessages = [
  {text: 'Hey, how are you?', isSender: false, timestamp: '10:30 AM'},
  {
    text: "I'm good, thanks! What about you?",
    isSender: true,
    timestamp: '10:32 AM',
  },
  {text: 'Sure, just let me know when!', isSender: true, timestamp: '10:36 AM'},
];

const chatPartnerName = 'John Doe';
const chatPartnerAvatar =
  'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg';

const MessageDetail = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages);

  const flatListRef = useRef(null);

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 75 : 0;

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        isSender: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };

      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMessage];
        setTimeout(
          () => flatListRef.current.scrollToEnd({animated: true}),
          100,
        );
        return updatedMessages;
      });
      setMessage('');
    }
  };

  const renderItem = ({item}) => (
    <View
      style={[
        styles.messageContainer,
        {alignSelf: item.isSender ? 'flex-end' : 'flex-start'},
      ]}>
      <View
        style={[
          styles.messageBubble,
          {backgroundColor: item.isSender ? '#cce4ff' : '#f2f2f2'},
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <Image source={{uri: chatPartnerAvatar}} style={styles.avatar} />
            <Text style={styles.headerText}>{chatPartnerName}</Text>
          </View>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.messagesList}
            keyboardShouldPersistTaps="handled"
            style={{flexGrow: 1}}
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
    //borderTopWidth: 1,
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
