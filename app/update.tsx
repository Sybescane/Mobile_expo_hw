import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, Switch } from 'react-native';
import eventStore from './EventStore';
import { Event } from './Event';
import { useRouter, useLocalSearchParams } from 'expo-router';
import categoryStore from './CategoryStore';

const UpdateEventScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [event, setEvent] = useState<Omit<Event, 'id' | 'isCompleted'>>({
        title: '',
        date: '',
        categoryId: '',
        canChecked: false,
    });

    useEffect(() => {
        const existingEvent = eventStore.events.find((e) => e.id === id);
        console.log(existingEvent);
        if (existingEvent) {
            setEvent({
                title: existingEvent.title,
                date: existingEvent.date,
                categoryId: existingEvent.categoryId,
                canChecked: existingEvent.canChecked,
            });
        }
    }, [id]);

    const handleSaveEvent = () => {
        if (!event.title || !event.date) {
            Alert.alert('Ошибка', 'Заполните все поля перед сохранением');
            return;
        }

        eventStore.updateEvent({ ...event, id: id, isCompleted: false });
        Alert.alert('Успех', 'Событие успешно обновлено');
        router.push('/'); // Возвращаемся на главную страницу
    };
    return (

        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Название события"
                value={event.title}
                onChangeText={(text) => setEvent({ ...event, title: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Дата события (например, 2024-12-31)"
                value={event.date}
                onChangeText={(text) => setEvent({ ...event, date: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Категория (например, Работа)"
                value={categoryStore.categories.find(x => x.id === event.categoryId)?.name}
                onChangeText={(text) => setEvent({ ...event, categoryId: categoryStore.categories.find(x => x.name === text)?.id })}
            />

            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Может быть выполнено:</Text>
                <Switch
                    value={event.canChecked}
                    onValueChange={(value) => setEvent({ ...event, canChecked: value })}
                />
            </View>

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

export default UpdateEventScreen;
