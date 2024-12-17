import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, Switch } from 'react-native';
import eventStore from './EventStore';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Category } from './Category';
import categoryStore from './CategoryStore';

const UpdateCategoryEventScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Состояние для формы
    const [event, setEvent] = useState<Omit<Category, 'id'>>({
        name: '',
    });

    useEffect(() => {
        const existingEvent = categoryStore.categories.find((e) => e.id.toString() === id);
        if (existingEvent) {
            setEvent({
                name: existingEvent.name,
                
            });
        }
    }, [id]);

    const handleSaveEvent = async () => {
        if (!event.name) {
            Alert.alert('Ошибка', 'Заполните все поля перед сохранением');
            return;
        }

        await categoryStore.updateCategory({ ...event, id: id});
        Alert.alert('Успех', 'Событие успешно обновлено');
        router.push('/'); // Возвращаемся на главную страницу
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Название категории"
                value={event.name}
                onChangeText={(text) => setEvent({ ...event, name: text })}
            />

            <Button title="Обновить событие" onPress={handleSaveEvent} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
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

export default UpdateCategoryEventScreen;
