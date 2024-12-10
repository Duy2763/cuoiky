import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser } from '../redux/usersSlice';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddUser = () => {
    const navigation = useNavigation();
    const route = useRoute();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const user = route.params?.user;
  const currentUser = useSelector((state) => state.users.currentUser);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPassword(user.password);
      setImage({ uri: user.image });
      setIsEdit(true);
    }
  }, [user]);

  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    } else {
        alert('No Image Selected', 'Please select an image to proceed.');
    }
  };

  const handleAddOrUpdateUser = async () => {
    if (!name || !password) {
      alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    if (!image) {
      alert('No Image Selected', 'Please select an image to upload.');
      return;
    }

    let imageUrl = image.uri;
    if (!isEdit || (isEdit && image.uri !== user.image)) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'upload');

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dx69bclf3/image/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        imageUrl = response.data.secure_url;
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        Alert.alert(
          'Upload Failed',
          `Failed to upload image: ${error.response?.data?.error?.message || error.message}`
        );
        return;
      }
    }

    if (isEdit) {
      dispatch(updateUser({ id: user.id, updatedUser: { name, password, image: imageUrl } }));
    } else {
      dispatch(addUser({ name, password, image: imageUrl }));
    }

    navigation.navigate('UserList');
  };

  return (
    <View style={styles.container}>
        {currentUser && (
            <View>
                <Text>{currentUser.name}</Text>
                <Image source={{ uri: currentUser.image }} style={{ width: 50, height: 50 }} />
            </View>
        )}
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter name" />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter password"
      />
      <input type="file" accept="image/*" onChange={handleSelectImage} />
      {image && <Image source={{ uri: image.uri || URL.createObjectURL(image) }} style={styles.image} />}
      <Button title={isEdit ? "Update User" : "Add User"} onPress={handleAddOrUpdateUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default AddUser;