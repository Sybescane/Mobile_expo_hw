import { View, Text, Button, TextInput, StyleSheet, Alert, Switch } from 'react-native';
import { Event } from './Event';
import React from 'react';
import { toJS } from 'mobx';
import { useRouter } from 'expo-router';
import categoryStore from './CategoryStore';
import { Category } from './Category';

const AddCategoryScreen = () => {
    const router = useRouter();

    const [event, setEvent] = React.useState<Omit<Category, 'id'>>({
        name: '',
    });

    const handleSaveEvent = async () => {
        if (!event.name) {
            Alert.alert('Ошибка', 'Заполните все поля перед сохранением');
            return;
        }
        const newEvent: Category = {
            ...event,
            id: Date.now().toString(),
        };

        await categoryStore.addCategory(newEvent.name);
        Alert.alert('Успех', 'Событие успешно добавлено');
        setEvent({ name: ''});
        router.push('/');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Название категории"
                value={event.name}
                onChangeText={(text) => setEvent({ ...event, name: text })}
            />

            <Button title="Сохранить категорию" onPress={handleSaveEvent} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    switchLabel: {
        flex: 1,
        fontSize: 16,
    },
});

export default AddCategoryScreen;
