import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, Button } from 'react-native';
import { fetchUsers, setCurrentUser } from '../redux/usersSlice';

const Login = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleLogin = () => {
        if (!username || !password) {
            alert('Missing Fields', 'Please fill in all fields.');
            return;
        }

        const user = users.find(user => user.name === username && user.password === password);
        if (user) {
            dispatch(setCurrentUser(user));
            navigation.navigate('UserList');
        } else {
            alert('Login Failed', 'Invalid username or password.');
        }
    };

    return (
        <View>
            <Text>Username</Text>
            <TextInput value={username} onChangeText={setUsername} />
            <Text>Password</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

export default Login;