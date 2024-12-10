import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../redux/usersSlice';
import { View, Text, Button, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserList = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const currentUser = useSelector((state) => state.users.currentUser);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDeleteUser = (id) => {
        dispatch(deleteUser(id));
    };

    return (
        <View>
            {currentUser && (
                <View>
                    <Text>{currentUser.name}</Text>
                    <Image source={{ uri: currentUser.image }} style={{ width: 50, height: 50 }} />
                </View>
            )}
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.name}</Text>
                        <Text>{item.password}</Text>
                        <Image source={{ uri: item.image }} style={{ width: 20, height: 20 }} />
                        <Button title="Delete" onPress={() => handleDeleteUser(item.id)} />
                        <Button title="Edit" onPress={() => navigation.navigate('AddUser', { user: item })} />
                    </View>
                )}
            />
            <Button title="Add User" onPress={() => navigation.navigate('AddUser')} />
        </View>
    );
};

export default UserList;